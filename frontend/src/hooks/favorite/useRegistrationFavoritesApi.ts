import { useState } from "react";
import useAuthBaseAPI from "../useAuthBaseAPI.ts";

type Props = {
  title: string;
};

export const useRegistrationFavoritesApi = () => {
  const { authBaseAPI } = useAuthBaseAPI();
  const [loading, setLoading] = useState(false);

  const registrationFavoritesApi = (props: Props) => {
    const { title } = props;
    setLoading(true);

    authBaseAPI({
      url: "/accounts/favorite-anime/registration/",
      httpMethod: "POST",
      requestData: { title: title },
    });
  };
  return { registrationFavoritesApi, loading };
};
