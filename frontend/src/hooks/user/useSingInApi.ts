import React, { useState } from "react";
import axios, { AxiosInstance } from "axios";
import { config } from "../../config.ts";
import useUserDetailApi from "./useUserDetail.ts";
import { useNavigate } from "react-router-dom";

type Props = {
  email: string;
  password: string;
};

export default function useSignInApi() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { userDetailApi, error } = useUserDetailApi();
  const navigate = useNavigate();

  const SingInApi = (props: Props) => {
    const { email, password } = props;
    const requestData = {
      email: email,
      password: password,
    };

    setLoading(true);
    setLoginError(false);

    const axiosInstanceWithHeaders: AxiosInstance = axios.create({
      withCredentials: true,
      baseURL: config.backendServer.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    axiosInstanceWithHeaders
      .post("accounts/user/login/", requestData)
      .then((res) => {
        userDetailApi();
        if (error) {
          navigate("/", { state: { error: true } });
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        setLoginError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return { SingInApi, loading, loginError };
}
