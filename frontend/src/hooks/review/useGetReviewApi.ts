import { useContext, useEffect, useState } from "react";
import useAuthBaseAPI from "../useAuthBaseAPI.ts";
import { SelectReviewContext } from "../../provider/SelectReview.tsx";

type Props = {
  data: {
    username: string;
    anime_title: string;
  };
};

const useGetReviewApi = () => {
  const { authBaseAPI, response, loading } = useAuthBaseAPI();
  const { setReviewsData } = useContext(SelectReviewContext);

  useEffect(() => {
    if (response?.status == 200) {
      setReviewsData(response.data);
    }
  }, [response]);

  const getReviewApi = (props: Props) => {
    const { data } = props;
    authBaseAPI({
      url: "accounts/review/get_review/",
      httpMethod: "GET",
      requestData: data,
    });
  };

  return { getReviewApi, loading };
};

export default useGetReviewApi;
