import * as React from "react";
import styled from "styled-components";
import SearchInput from "../atom/Input/Search.tsx";
import LoginButton from "../atom/button/LoginButton.tsx";

const Sdiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const SwrapSearchInput = styled.div`
  position: absolute;
  width: 20vw;
  min-width: 100px;
  top: 7;
  right: 50px;
  margin: 40px;
`;

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

export default function IsNotLoginNaviber() {
  return (
    <Sdiv role="presentation" onClick={handleClick}>
      <LoginButton />
      <SwrapSearchInput>
        <SearchInput />
      </SwrapSearchInput>
    </Sdiv>
  );
}
