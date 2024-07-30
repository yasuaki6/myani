import React, { useEffect } from "react";
import useChackToken from "../../hooks/user/useChackTokenApi.ts";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const TokenChackPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { chackToken, response } = useChackToken();

  useEffect(() => {
    if (params.token) {
      chackToken({ token: params.token });
    }
  }, [params.token]);

  useEffect(() => {
    if (response === 200) {
      navigate("/", { state: { success: true, message: "認証完了" } });
    } else if (response <= 400) {
      navigate("/", { state: { error: true } });
    }
  }, [response]);

  return <></>;
};
