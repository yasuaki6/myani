import useAuthBaseAPI from "../useAuthBaseAPI.ts";

type Props = {
  data: {
    anime_title: string;
    author: string;
    review_title: string;
    body: string;
    star: string;
  };
};

const useCreateReview = () => {
  const { authBaseAPI, response, loading } = useAuthBaseAPI();

  const createReviewApi = (props: Props) => {
    const { data } = props;
    authBaseAPI({
      url: "accounts/review/review_create/",
      httpMethod: "POST",
      requestData: data,
    });
  };

  return { createReviewApi, response, loading };
};

export default useCreateReview;
