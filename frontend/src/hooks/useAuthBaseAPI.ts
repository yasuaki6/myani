import { useState, useContext } from "react";
import axios, { AxiosResponse, AxiosInstance, AxiosError } from "axios";
import { config } from "../config.ts";
import { UserContext } from "../provider/UserProvider.tsx";
import { useNavigate } from "react-router-dom";

type httpMethod = "GET" | "POST" | "PUT" | "DELETE";

type Props = {
  url: string;
  httpMethod: httpMethod;
  requestData?: { [key: string]: any };
};

const axiosInstanceWithHeaders: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: config.backendServer.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function useAuthBaseAPI() {
  const [response, setResponse] = useState<{
    status: number;
    data?: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { setIsLogin, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const authBaseAPI = (props: Props) => {
    const { url, httpMethod, requestData } = props;

    setLoading(true);
    setResponse(null);

    switch (httpMethod) {
      case "GET":
        axiosInstanceWithHeaders
          .get(url, { params: requestData })
          .then((res: AxiosResponse) => {
            setResponse({
              status: res.status,
              data: res.data,
            });
          })
          .catch((error: AxiosError) => {
            //アクセストークンの有効期限切れの可能性
            if (error.response?.status == 401) {
              axiosInstanceWithHeaders
                .get("accounts/api/token/custom_refresh/")
                .then(() => {
                  axiosInstanceWithHeaders
                    .get(url)
                    .then((res: AxiosResponse) => {
                      setResponse({
                        status: res.status,
                        data: res.data,
                      });
                    })
                    .catch((error) => {
                      setResponse({
                        status: error.response.status,
                        data: error.response.data,
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
                  ...(!error.response.data && { data: error.response.data }),
                });
              } else {
                navigate("/", { state: { error: true } });
              }
            }
          })
          .finally(() => {
            setLoading(false);
          });
        break;

      case "POST":
        axiosInstanceWithHeaders
          .post(url, requestData)
          .then((res: AxiosResponse) => {
            setResponse({
              status: res.status,
              data: res.data,
            });
          })
          .catch((error: AxiosError) => {
            //アクセストークンの有効期限切れの可能性
            if (error.response?.status == 401) {
              axiosInstanceWithHeaders
                .get("accounts/api/token/custom_refresh/")
                .then(() => {
                  axiosInstanceWithHeaders
                    .post(url, requestData)
                    .then((res: AxiosResponse) => {
                      setResponse({
                        status: res.status,
                        data: res.data,
                      });
                    })
                    .catch((error) => {
                      setResponse({
                        status: error.response.status,
                        data: error.response.data,
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
        break;
      case "DELETE":
        axiosInstanceWithHeaders
          .delete(url, { data: requestData })
          .then((res: AxiosResponse) => {
            setResponse({
              status: res.status,
              ...(res.data && { data: res.data }),
            });
          })
          .catch((error: AxiosError) => {
            //アクセストークンの有効期限切れの可能性
            if (error.response?.status == 401) {
              axiosInstanceWithHeaders
                .get("accounts/api/token/custom_refresh/")
                .then(() => {
                  axiosInstanceWithHeaders
                    .delete(url, requestData)
                    .then((res: AxiosResponse) => {
                      setResponse({
                        status: res.status,
                        data: res.data,
                      });
                    })
                    .catch((error) => {
                      setResponse({
                        statu: error.response.status,
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
        break;
      case "PUT":
        axiosInstanceWithHeaders
          .put(url, requestData)
          .then((res: AxiosResponse) => {
            setResponse({
              status: res.status,
              ...(res.data && { data: res.data }),
            });
          })
          .catch((error: AxiosError) => {
            //アクセストークンの有効期限切れの可能性
            if (error.response?.status == 401) {
              axiosInstanceWithHeaders
                .get("accounts/api/token/custom_refresh/")
                .then(() => {
                  axiosInstanceWithHeaders
                    .put(url, requestData)
                    .then((res: AxiosResponse) => {
                      setResponse({
                        status: res.status,
                        data: res.data,
                      });
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
        break;
    }
  };

  return { authBaseAPI, response, loading };
}
