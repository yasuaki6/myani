import React, {
  useEffect,
  useState,
  useContext,
  FC,
  memo,
  useCallback,
} from "react";
import useAnimeApi from "../../hooks/useAnimeApi.ts";
import useWindowSize from "../../hooks/window.ts";
import styled from "styled-components";
import AnimeCard from "../organism/AnimeCard.tsx";
import { useSelectAnime } from "../../hooks/useSelectAnime.ts";
import AnimeModal from "../organism/modal/AnimeModal.tsx";
import { UserContext } from "../../provider/UserProvider.tsx";
import IsLoginNaviber from "../layout/IsLoginNaviber.tsx";
import { Logo } from "../layout/Logo.tsx";
import Title from "../atom/title/Title.tsx";
import ErrorAlert from "../atom/alert/ErrorAlert.tsx";
import { useLocation } from "react-router-dom";
import getAnimeCardSize from "../../functions/AnimeCardSize.ts";
import useUserDetailApi from "../../hooks/user/useUserDetail.ts";
import getTitleSize from "../../functions/TitleSize.ts";
import IsNotLoginNaviber from "../layout/IsNotLoginNaviber.tsx";
import SuccessAlert from "../atom/alert/SuccessAlert.tsx";

export const MainPage: FC = memo(() => {
  const location = useLocation();
  const state = location.state;

  const { getAnimeInfo, animeInfo } = useAnimeApi();
  const { windowSize, handleResize } = useWindowSize();
  const [iconSize, setIconSize] = useState(getAnimeCardSize(windowSize.width));
  const [titleSize, setTitleSize] = useState(getTitleSize(windowSize.width));
  const innerHeight = window.innerHeight;
  const { isLogin } = useContext(UserContext);
  const { userDetailApi } = useUserDetailApi();

  const handleWindowScroll = (event) => {
    const totalHeight = (document.body.scrollHeight * 3) / 4;
    const scrollY = window.scrollY;
    if (innerHeight + scrollY > totalHeight) {
      getAnimeInfo(10);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      userDetailApi();
    }
    getAnimeInfo(30);
    window.addEventListener("scroll", handleWindowScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  useEffect(() => {
    setIconSize(getAnimeCardSize(windowSize.width));
    setTitleSize(getTitleSize(windowSize.width));
  }, [windowSize]);

  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const { onSelectAnime, selectAnimeInfo } = useSelectAnime();

  const opneModla = useCallback(
    (selectTitle: string) => {
      onSelectAnime({
        selectTitle: selectTitle,
        animeTitles: animeInfo,
        onOpen: handleOpen,
      });
    },
    [animeInfo]
  );
  return (
    <Spage>
      {state && state.error && <ErrorAlert></ErrorAlert>}
      {state && state.success && <SuccessAlert message=""></SuccessAlert>}
      <Logo />
      {isLogin ? <IsLoginNaviber /> : <IsNotLoginNaviber />}
      <STitleWarp>
        <Title fontsize={titleSize} margin="0"></Title>
      </STitleWarp>

      <SAnimeCardWarp>
        {animeInfo.map((info, index) => (
          <AnimeCard
            img={info.img}
            iconSize={iconSize}
            title={info.title}
            handleOpen={opneModla}
          ></AnimeCard>
        ))}
      </SAnimeCardWarp>
      <AnimeModal
        img={selectAnimeInfo?.img}
        title={selectAnimeInfo?.title}
        overview={selectAnimeInfo?.overview}
        broadcast={selectAnimeInfo?.broadcast}
        is_open={isOpen}
        handleClose={handleClose}
        apiType="RANDOM"
      ></AnimeModal>
    </Spage>
  );
});

const SAnimeCardWarp = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #f5f5f7;
`;
//rgb(240, 215, 110)
//rgb(245, 174, 68)

const Spage = styled.div`
  background-color: #f5f5f7;
  margin: 0;
`;

const STitleWarp = styled.div`
  background-color: #f5f5f7;
`;

export default MainPage;
