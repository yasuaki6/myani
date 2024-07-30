import { useEffect, useState } from "react";
import useAuthBaseAPi from "../useAuthBaseAPI.ts";
import { useNavigate } from "react-router-dom";

type Props = {
  password: string;
};

export default function useCheckPasswordApi() {
  const { authBaseAPI, response, loading } = useAuthBaseAPi();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (response?.status == 200) {
      navigate("/setting", { state: { isAdmin: true } });
    } else if (response?.status == 400) {
      setError(true);
    } else {
      return;
    }
  }, [response]);

  const checkPasswordApi = (props: Props) => {
    const { password } = props;

    authBaseAPI({
      url: "accounts/user/check_password/",
      httpMethod: "POST",
      requestData: { password: password },
    });
  };

  return { checkPasswordApi, error, loading };
}
