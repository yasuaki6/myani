import useAuthBaseAPI from "../useAuthBaseAPI.ts";
import React, { useState } from "react";
import { UserContext } from "../../provider/UserProvider.tsx";

type Props = {
  username: string;
  identifier: string;
};

const useEditUserInfo = () => {
  const { authBaseAPI, response, loading } = useAuthBaseAPI();
  const { userInfo, setUserInfo } = React.useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [usernameTmp, setUsernameTmp] = useState("");
  const [identifierTmp, setIdentifierTmp] = useState("");

  React.useEffect(() => {
    if (response != null) {
      if (response!.status == 200) {
        setUserInfo({
          email: userInfo!.email,
          username: usernameTmp,
          identifier: identifierTmp,
          is_email_verified: userInfo!.is_email_verified,
          icon: userInfo?.icon,
        });
      } else if (response?.status == 400) {
        setError(true);
        setErrorMessage(response.data[Object.keys(response.data)[0]]);
      }
    }
  }, [response]);

  const editUserInfoApi = (props: Props) => {
    const { username, identifier } = props;
    setUsernameTmp(username);
    setIdentifierTmp(identifier);
    setError(false);

    authBaseAPI({
      url: "accounts/user/edit_user_info/",
      httpMethod: "PUT",
      requestData: { username: username, identifier: identifier },
    });
  };
  return { editUserInfoApi, error, loading, errorMessage };
};

export default useEditUserInfo;
