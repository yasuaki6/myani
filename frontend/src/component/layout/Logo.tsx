import React, { memo, FC } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Title from "../atom/title/Title.tsx";

const Swrap = styled.div`
  position: absolute;
  margin: 5px 15px;
  top: 0;
  left: 0;
`;

export const Logo: FC = memo(() => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  return (
    <Swrap onClick={handleClick}>
      <Title fontsize="8px" padding="4px" colors={["nrack"]}></Title>
    </Swrap>
  );
});
