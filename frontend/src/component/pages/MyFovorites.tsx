import React, { useRef, useEffect, useContext, useState, FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetListApi from "../../hooks/favorite/useGetListApi.ts";
import { UserContext } from "../../provider/UserProvider.tsx";
import IsLoginNaviber from "../layout/IsLoginNaviber.tsx";
import { Logo } from "../layout/Logo.tsx";
import styled from "styled-components";
import UserProfileTop from "../molecule/card/UserProfileTop.tsx";
import MyFavoritesBody from "../molecule/MyFavoritesBody.tsx";
import Loading from "../atom/progress/Loading.tsx";
import AnimeModal from "../organism/modal/AnimeModal.tsx";
import useUserDetailApi from "../../hooks/user/useUserDetail.ts";
import useGetUserProfile from "../../hooks/user/useGetUserProfile.ts";
import IsNotLoginNaviber from "../layout/IsNotLoginNaviber.tsx";

type RouteParams = {
  username: string;
  identifier: string;
};

const Snaviberwrap = styled.div`
  height: 50px;
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: 300px minmax(100vh, auto);
  margin: 10px;
  overflow-y: auto;
`;

export const MyFavorites: FC = () => {
  const { username, identifier } = useParams<RouteParams>();
  const [isAdmin, setIsAdmin] = useState(false);
  const { userInfo, isLogin } = useContext(UserContext);
  const { getListApi, favoriteList, loading, error } = useGetListApi();
  const { userDetailApi } = useUserDetailApi();
  const navigate = useNavigate();

  const [selectTitle, setSelectTitle] = useState("");
  const [selectAnimeInfo, setSelectAnimeInfo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { response, getUserProfile } = useGetUserProfile();
  const isFirstRenderForSelectAnime = useRef(true);

  useEffect(() => {
    if (!isLogin) {
      userDetailApi();
    }
    if (username && identifier) {
      if (
        username === userInfo?.username &&
        identifier === userInfo?.identifier
      ) {
        setIsAdmin(true);
      }
      getListApi({ username: username, identifier: identifier });
      getUserProfile({ username: `${username}#${identifier}` });
    } else {
      navigate("/", { state: { error: true } });
    }
  }, [username, identifier]);

  useEffect(() => {
    if (isFirstRenderForSelectAnime.current) {
      isFirstRenderForSelectAnime.current = false;
      return;
    } else {
      if (selectTitle === "") {
        return;
      } else {
        const findKey = Object.keys(favoriteList).find(
          (key) => key === selectTitle
        );
        if (findKey !== undefined) {
          setSelectAnimeInfo({ ...favoriteList[findKey], title: findKey });
        }
        setIsOpen(true);
      }
    }
  }, [selectTitle]);

  const handleModal = (title: string) => {
    setSelectTitle(title);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectTitle("");
    setSelectAnimeInfo({});
  };

  return (
    <div style={{ backgroundColor: "#f5f5f7", height: "100vh" }}>
      <Snaviberwrap>
        <Logo />
        {isLogin ? <IsLoginNaviber /> : <IsNotLoginNaviber />}
      </Snaviberwrap>

      <Grid>
        <UserProfileTop
          icon={response.icon}
          userProfileBackground={response.background}
          status={response.status}
          isAdmin={isAdmin}
          username={`${username}#${identifier}`}
        />
        {loading ? (
          <Loading />
        ) : (
          <MyFavoritesBody datas={favoriteList} callBackFnc={handleModal} />
        )}
      </Grid>
      <AnimeModal
        img={selectAnimeInfo?.img}
        title={selectAnimeInfo?.title}
        overview={selectAnimeInfo?.overview}
        broadcast={selectAnimeInfo?.broadcast}
        is_open={isOpen}
        handleClose={handleClose}
        apiType="DETAIL"
        username={`${username}#${identifier}`}
      ></AnimeModal>
    </div>
  );
};

export default MyFavorites;
