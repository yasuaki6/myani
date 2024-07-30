import { useState } from "react";
import useAuthBaseAPI from "../useAuthBaseAPI.ts";

type Props = {
  title: string;
};

const useDeleteFavoritesApi = () => {
  const [loading, setLoading] = useState(false);
  const { authBaseAPI } = useAuthBaseAPI();

  const deleteFavoritesApi = (props: Props) => {
    const { title } = props;
    setLoading(true);

    authBaseAPI({
      url: "/accounts/favorite-anime/delete/",
      httpMethod: "DELETE",
      requestData: { anime_title: title },
    });
  };
  return { deleteFavoritesApi, loading };
};

export default useDeleteFavoritesApi;
