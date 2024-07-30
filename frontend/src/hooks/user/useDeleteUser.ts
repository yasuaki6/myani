import { useContext, useEffect, useState, useRef } from "react";
import useAuthBaseAPI from "../useAuthBaseAPI.ts";
import { UserContext } from "../../provider/UserProvider.tsx";
import { useNavigate } from "react-router-dom";
import { CatchingPokemonSharp } from "@mui/icons-material";

const useDeleteUser = () => {
  const { authBaseAPI, response } = useAuthBaseAPI();
  const { setIsLogin, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (response?.status == 200) {
      setIsLogin(false);
      setUserInfo(null);
      navigate("/");
    } else if (response?.status == 400 || response?.status == 500) {
      navigate("/", { state: { error: true } });
    }
  }, [response]);

  const deleteUserApi = () => {
    authBaseAPI({ url: "accounts/user/delete/", httpMethod: "DELETE" });
  };
  return { deleteUserApi };
};

export default useDeleteUser;
