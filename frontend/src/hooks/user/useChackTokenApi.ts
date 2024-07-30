import axios from "axios";
import { config } from "../../config.ts";
import { useState } from "react";

type Props = {
  token: string;
};

export const useChackToken = () => {
  const [response, setResponse] = useState<number>(0);
  const chackToken = (props: Props) => {
    const { token } = props;
    axios
      .get(
        `${config.backendServer.baseURL}/accounts/user/confirm_registration/?token=${token}`
      )
      .then((res) => {
        setResponse(res.status);
      })
      .catch((res) => {
        setResponse(res.status);
      });
  };
  return { chackToken, response };
};

export default useChackToken;
