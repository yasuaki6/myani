import { useContext, useEffect } from "react";
import useAuthBaseAPI from "../useAuthBaseAPI.ts";
import { SelectReviewContext } from "../../provider/SelectReview.tsx";

type Props = {
  data: {
    anime_title: string;
    author: string;
  };
};

const useDeleteReview = () => {
  const { authBaseAPI, response, loading } = useAuthBaseAPI();
  const { setReviewReloadFlag } = useContext(SelectReviewContext);

  useEffect(() => {
    if (response?.status === 200) {
      setReviewReloadFlag((prevFlag) => !prevFlag);
    }
  }, [response]);

  const deleteReviewApi = (props: Props) => {
    const { data } = props;
    authBaseAPI({
      url: "accounts/review/delete/",
      httpMethod: "DELETE",
      requestData: data,
    });
  };

  return { deleteReviewApi, response, loading };
};

export default useDeleteReview;
