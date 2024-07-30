import React, { useState } from "react";
import axios, { AxiosInstance } from "axios";
import { config } from "../../config.ts";
import { useNavigate } from "react-router-dom";
import useSingInApi from "./useSingInApi.ts";

type Props = {
  username: string;
  email: string;
  password: string;
  repassword: string;
};

export const useSingUpApi = () => {
  const { SingInApi } = useSingInApi();
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessage] = useState([]);
  const navigate = useNavigate();

  const SingUpApi = (props: Props) => {
    const { username, email, password, repassword } = props;

    setLoading(true);
    setErrorMessage([]);

    const requestData = {
      username: username,
      password: password,
      email: email,
      re_password: repassword,
    };

    const axiosInstanceWithHeaders: AxiosInstance = axios.create({
      baseURL: config.backendServer.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    axiosInstanceWithHeaders
      .post("accounts/user/registration/", requestData)
      .then((res) => {
        SingInApi({ email: email, password: password });
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(Object.values(error.response.data.error));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return { SingUpApi, loading, errorMessages };
};
