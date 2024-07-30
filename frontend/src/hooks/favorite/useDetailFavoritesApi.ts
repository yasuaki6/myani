import { useEffect, useState } from "react";
import useAuthBaseAPI from "../useAuthBaseAPI.ts";

type Props = {
  username: string;
  identifier: string;
  title: string;
};

const useDetailFavoriteApi = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(false);
  const { authBaseAPI, response, loading } = useAuthBaseAPI();

  useEffect(() => {
    if (response?.status == 200 && response?.data["favorite_state"]) {
      setIsFavorite(true);
    } else if (response?.status == 200 && !response?.data["favorite_state"]) {
      setIsFavorite(false);
    }
  }, [response]);

  const detailFavoriteApi = (props: Props) => {
    const { username, identifier, title } = props;

    setError(false);
    setIsFavorite(false);

    authBaseAPI({
      url: `/accounts/favorite-anime/get_detail/`,
      httpMethod: "GET",
      requestData: { username: `${username}#${identifier}`, title: title },
    });
  };
  return { isFavorite, setIsFavorite, detailFavoriteApi, error, loading };
};

export default useDetailFavoriteApi;
