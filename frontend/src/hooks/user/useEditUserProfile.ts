import { useContext, useState } from "react";
import { UserProfileContext } from "../../provider/UserProfileProvider.tsx";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { AxiosInstance } from "axios";
import { config } from "../../config.ts";
import { UserContext } from "../../provider/UserProvider.tsx";

type Props = {
  icon?: string;
  background?: string;
  status?: string;
};

type Response = {
  statu: number;
  data: {};
};

const axiosInstanceWithHeaders: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: config.backendServer.baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const useEditUserProfile = () => {
  //const { authBaseAPI, response, loading } = useAuthBaseAPI()
  const { setUserProfile, userProfile, setUserProfileReloadFlag } =
    useContext(UserProfileContext);
  const [response, setResponse] = useState<Response | null>(null);
  const [statusTmp, setStatusTmp] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLogin, setUserInfo } = useContext(UserContext);

  const editUserProfile = (props: Props) => {
    const { icon, background, status } = props;
    status ? setStatusTmp(status) : setStatusTmp(userProfile?.statusMessage);

    const requestData = {
      ...(icon && { icon: icon }),
      ...(background && { background: background }),
      ...(status && { status_message: status }),
    };

    axiosInstanceWithHeaders
      .put("accounts/user-profile/edit_userprofile/", requestData)
      .then((res: AxiosResponse) => {
        setResponse({
          status: res.status,
          ...(res.data && { data: res.data }),
        });
        setUserProfile({
          icon: `${userProfile?.icon}?version=${Date.now()}`,
          statusMessage: statusTmp,
          background: `${userProfile?.background}?version=${Date.now()}`,
        });
        setUserProfileReloadFlag((prevFlag) => !prevFlag);
      })
      .catch((error: AxiosError) => {
        //アクセストークンの有効期限切れの可能性
        if (error.response?.status == 401) {
          axiosInstanceWithHeaders
            .get("accounts/api/token/custom_refresh/")
            .then(() => {
              axiosInstanceWithHeaders
                .put("accounts/user-profile/edit_userprofile/", requestData)
                .then((res: AxiosResponse) => {
                  setResponse({
                    status: res.status,
                    ...(res.data && { data: res.data }),
                  });
                  setUserProfile({
                    icon: `${userProfile?.icon}?version=${Date.now()}`,
                    statusMessage: statusTmp,
                    background: `${
                      userProfile?.background
                    }?version=${Date.now()}`,
                  });
                  setUserProfileReloadFlag((prevFlag) => !prevFlag);
                })
                .catch((error) => {
                  setResponse({
                    status: error.response.status,
                    ...(error.response.data && {
                      data: error.response.data,
                    }),
                  });
                });
            })
            //refreshも有効期限が切れている場合、ログアウト状態にする
            .catch(() => {
              setLoading(false);
              setIsLogin(false);
              setUserInfo(null);
              navigate("/");
            });
        } else {
          if (error.response) {
            setResponse({
              status: error.response.status,
              data: error.response.data,
            });
          } else {
            navigate("/", { state: { error: true } });
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return { editUserProfile, response };
};

export default useEditUserProfile;
