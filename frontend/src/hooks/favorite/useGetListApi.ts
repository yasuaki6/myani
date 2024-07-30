import { useState, useEffect } from "react";
import { config } from "../../config.ts";
import useAuthBaseAPI from "../useAuthBaseAPI.ts";
import { useNavigate } from "react-router-dom";

type Props = {
  username: string;
  identifier: string;
};

type FavoriteListType = {
  title: {
    overview: string;
    img: string;
    broadcast: string;
  };
};

const useGetListApi = () => {
  const [favoriteList, setFavoriteList] = useState<FavoriteListType | {}>({});
  const [error, setError] = useState(false);
  const { authBaseAPI, response, loading } = useAuthBaseAPI();
  const url =
    config.backendServer.baseURL + "/accounts/favorite-anime/get_list/";
  const navigate = useNavigate();

  useEffect(() => {
    if (response?.status === 200) {
      setFavoriteList(response.data);
    } else if (response?.status === 400 || response?.status === 404) {
      navigate("/notfind");
    }
  }, [response]);

  const getListApi = (props: Props) => {
    const { username, identifier } = props;
    const requestData = { username: `${username}#${identifier}` };

    authBaseAPI({ url: url, httpMethod: "GET", requestData: requestData });
  };

  return { getListApi, favoriteList, loading, error };
};

export default useGetListApi;
