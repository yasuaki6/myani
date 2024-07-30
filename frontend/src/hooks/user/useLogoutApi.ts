import { useState, useContext } from "react";
import { UserContext } from "../../provider/UserProvider.tsx";
import useAuthBaseAPi from "../useAuthBaseAPI.ts";
import { useNavigate } from "react-router-dom";

export default function useLogoutApi() {
  const { setIsLogin, setUserInfo } = useContext(UserContext);
  const { authBaseAPI, response, loading } = useAuthBaseAPi();
  const navigate = useNavigate();
  const logoutApi = () => {
    authBaseAPI({ url: "accounts/user/logout/", httpMethod: "POST" });
    setIsLogin(false);
    setUserInfo(null);
    navigate("/");
    return;
  };
  return { logoutApi, loading };
}
