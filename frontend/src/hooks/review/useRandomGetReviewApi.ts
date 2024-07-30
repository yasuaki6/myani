import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SelectReviewContext } from "../../provider/SelectReview.tsx";
import { config } from "../../config.ts";

type Props = {
  data: {
    anime_title: string;
    number: number;
  };
};

const useRandomGetReviewApi = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setReviewsData } = useContext(SelectReviewContext);

  const randomGetReviewApi = (props: Props) => {
    setLoading(true);
    const { data } = props;
    setError(false);
    setReviewsData([]);

    axios
      .get(config.backendServer.baseURL + "/accounts/review/random_get/", {
        params: data,
      })
      .then((res) => {
        setReviewsData(res.data);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };
  return { randomGetReviewApi, error, loading };
};

export default useRandomGetReviewApi;
