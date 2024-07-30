import useAuthBaseAPI from "../useAuthBaseAPI";
import { useState } from "react";

type Props = {
  data: {
    anime_title: string;
    author: string;
    review_title?: string;
    body?: string;
    star?: string;
  };
};

const useEditReview = () => {
  const { authBaseAPI, response, loading } = useAuthBaseAPI();

  const EditReview = (props: Props) => {
    const { data } = props;
    authBaseAPI({
      url: "accounts/review/create/",
      httpMethod: "PUT",
      requestData: data,
    });
  };

  return { EditReview, response, loading };
};

export default useEditReview;
