import { useState, useContext, useEffect } from "react";
import axios, { AxiosInstance } from "axios";
import { config } from "../../config.ts";
import { UserContext } from "../../provider/UserProvider.tsx";
import useGetUserProfile from "./useGetUserProfile.ts";
import { UserProfileContext } from "../../provider/UserProfileProvider.tsx";

export default function useUserDetailApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setIsLogin, setUserInfo } = useContext(UserContext);
  const { setUserProfile, userProfile } = useContext(UserProfileContext);
  const { getUserProfile, response } = useGetUserProfile();

  useEffect(() => {
    if (Object.keys(response).length !== 0) {
      setUserProfile(response);
    } else {
      return;
    }
  }, [response]);

  const userDetailApi = () => {
    const axiosInstanceWithHeaders: AxiosInstance = axios.create({
      withCredentials: true,
      baseURL: config.backendServer.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(true);
    setError(false);

    axiosInstanceWithHeaders
      .get("accounts/user/get_detail/")
      .then((res) => {
        setUserInfo(res.data);
        setIsLogin(true);
        getUserProfile({
          username: `${res.data.username}#${res.data.identifier}`,
        });
      })
      .catch((error) => {
        if (error.status === 401) {
          return;
        } else {
          return;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return { userDetailApi, loading, error };
}
