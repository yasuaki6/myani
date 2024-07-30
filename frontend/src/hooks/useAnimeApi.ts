import { useState } from "react";
import axios from "axios";
import { animeInfoType } from "../types/api/animeInfo.ts";
import { config } from "../config.ts";

export default function useAnimeApi() {
  const [animeInfo, setTitleInfo] = useState<Array<animeInfoType>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getAnimeInfo = (number: number) => {
    setLoading(true);
    setError(false);

    axios
      .get<Array<animeInfoType>>(
        config.backendServer.baseURL + `/api/animetitle/${number}/`
      )
      .then((res) => {
        const data = res.data.map((animeInfo) => ({
          title: animeInfo.title,
          overview: animeInfo.overview,
          img: animeInfo.img,
          broadcast: animeInfo.broadcast,
          officialsite: null,
          pv: null,
        }));
        setTitleInfo((prevTitleInfo) => [...prevTitleInfo, ...data]);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { getAnimeInfo, animeInfo, loading, error };
}
