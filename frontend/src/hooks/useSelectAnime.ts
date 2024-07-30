import React, { memo, useCallback, useState } from "react";
import { animeInfoType } from "../types/api/animeInfo";

type Props = {
  selectTitle: string;
  animeTitles: Array<animeInfoType>;
  onOpen: () => void;
};

export const useSelectAnime = () => {
  const [selectAnimeInfo, setSlectedAnime] = useState<animeInfoType>();

  const onSelectAnime = useCallback((props: Props) => {
    const { selectTitle, animeTitles, onOpen } = props;
    const tmp = animeTitles.find((obj) => obj.title === selectTitle);
    setSlectedAnime(tmp!);
    onOpen();
  }, []);

  return { onSelectAnime, selectAnimeInfo };
};
