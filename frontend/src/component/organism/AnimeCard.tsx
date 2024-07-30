import React, { FC } from "react";
import styled, { keyframes } from "styled-components";
import ChackFullPATH from "../../functions/CheckFullPass.ts";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  25%{
    transform: rotate(360deg);
  }

  50%{
    transform: rotate(720deg);
  }

  75%{
    transform: rotate(920deg)
  }

  100% {
    transform: rotate(1080deg);
  }
`;

const scaleUp = keyframes`
0% {
  transform: scale(0,0);
}

20% {
  transform: scale(0.1,0.1);
}

40%{
  transform: scale(0.3,0.3);
}

100% {
  transform: scale(1,1);
}
`;

interface SIconCardProps {
  width: number;
  height: number;
}

const SIconCard = styled.div<SIconCardProps>`
  margin: 1%;
  border-radius: 20%;
  animation: ${scaleUp} 2s forwards;
  user-select: none;
`;

const SImg = styled.img`
border-radius: 20%;
box-shadow:0px 10px 10px 0px #c0c0c0;
animation:${rotate} 2s linear
transition: transform 0.3s ease;
&:hover{
  transform: scale(1.1);
};
`;

type Props = {
  img: string;
  iconSize: number;
  title: string;
  handleOpen: (title: string) => void;
};

const AnimeCard: FC<Props> = (props) => {
  const { img, iconSize, title, handleOpen } = props;
  const imgPath = ChackFullPATH(img);

  return (
    <>
      <SIconCard
        width={iconSize}
        height={iconSize}
        onClick={() => handleOpen(title)}
      >
        <SImg
          draggable="false"
          width={iconSize}
          height={iconSize}
          src={imgPath}
          alt="animeicon"
        ></SImg>
      </SIconCard>
    </>
  );
};

export default AnimeCard;
