import { useEffect, useState } from "react";
import useAuthBaseAPi from "../useAuthBaseAPI.ts";
import { useNavigate } from "react-router-dom";

type Props = {
  currentPassword: string;
  newPassword: string;
  rePassword: string;
};

export default function useChangePasswordApi() {
  const { authBaseAPI, response, loading } = useAuthBaseAPi();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (response?.status == 200) {
      navigate("/");
    } else if (response?.status == 400) {
      setError(true);
    } else {
      return;
    }
  }, [response]);

  const changePasswordApi = (props: Props) => {
    const { currentPassword, newPassword, rePassword } = props;

    authBaseAPI({
      url: "accounts/user/change_password/",
      httpMethod: "POST",
      requestData: {
        current_password: currentPassword,
        new_passwored: newPassword,
        confirm_password: rePassword,
      },
    });
  };

  return { changePasswordApi, error, loading };
}
