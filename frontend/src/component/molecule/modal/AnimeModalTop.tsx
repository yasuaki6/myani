import React, { FC, useContext, useEffect, memo, useState } from "react";
import styled from "styled-components";
import useDetailFavoriteApi from "../../../hooks/favorite/useDetailFavoritesApi.ts";
import { UserContext } from "../../../provider/UserProvider.tsx";
import DeleteFavoritesIcon from "../icon/DeleteFavoritesIcon.tsx";
import RegisterFavoritesIcon from "../icon/RegisterFavoritesIcon.tsx";
import ChackFullPATH from "../../../functions/CheckFullPass.ts";

const SImageContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SImage = styled.img`
  width: 100%;
  height: 508px;
  display: block;
  filter: brightness(0.7);
  border-radius: 5px;
`;
const SGradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(31, 31, 31, 0) 85%,
    rgba(31, 31, 31, 1)
  );
  opacity: 1;
  pointer-events: none;
`;

const STextOverlay = styled.div`
  position: absolute;
  padding: 20px;
  bottom: -50px;
`;

const STitle = styled.h1`
  font-size: 2rem;
  color: #fff;
  padding: 1rem 0rem;
`;

const STop = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-height: 508px;
  user-select: none;
`;

const PositionedIcon = styled.div`
  position: absolute;
  bottom: 0px;
  right: 4%;
  z-index: 4;
`;

type Props = {
  img: string;
  title: string;
};

export const AnimeModalTop: React.FC<Props> = memo((props) => {
  const { img, title } = props;
  const { isFavorite, setIsFavorite, detailFavoriteApi, error } =
    useDetailFavoriteApi();
  const { isLogin, userInfo } = useContext(UserContext);
  const imgPath = ChackFullPATH(img);

  useEffect(() => {
    if (isLogin) {
      detailFavoriteApi({
        username: userInfo!.username!,
        identifier: userInfo!.identifier!,
        title: title,
      });
    }
  }, [title]);

  return (
    <STop>
      <SImageContainer>
        <SImage draggable="false" src={imgPath} alt="Image" className="image" />
        <SGradientOverlay />

        {isLogin ? (
          isFavorite ? (
            <PositionedIcon>
              <DeleteFavoritesIcon
                title={title}
                setIsFavorite={setIsFavorite}
              ></DeleteFavoritesIcon>
            </PositionedIcon>
          ) : (
            <PositionedIcon>
              <RegisterFavoritesIcon
                title={title}
                setIsFavorite={setIsFavorite}
              ></RegisterFavoritesIcon>
            </PositionedIcon>
          )
        ) : null}

        <STextOverlay>
          <STitle>{title}</STitle>
        </STextOverlay>
        <p
          style={{
            position: "relative",
            color: "#fff",
            padding: "0px",
            left: "45%",
            margin: "0px",
            width: "100%",
            bottom: "30px",
            opacity: "0.33",
            zIndex: 3,
          }}
        >
          © TOEI ANIMATION
        </p>
      </SImageContainer>
    </STop>
  );
});

export default AnimeModalTop;
