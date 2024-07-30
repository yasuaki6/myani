import axios, { AxiosInstance } from "axios";
import { config } from "../../config.ts";
import { useState } from "react";

type Props = {
  username: string;
};
const useSerchUsername = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState({});

  const serchUsername = (props: Props) => {
    const { username } = props;
    setLoading(true);
    setError(false);
    setResponse({});

    const axiosInstanceWithHeaders: AxiosInstance = axios.create({
      baseURL: config.backendServer.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    axiosInstanceWithHeaders
      .post("accounts/user/username_filter/", { username: username })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return { response, error, loading, serchUsername };
};

export default useSerchUsername;
