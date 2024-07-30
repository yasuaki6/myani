import React, { useContext } from "react";
import IsLoginNaviber from "../layout/IsLoginNaviber.tsx";
import IsNotLoginNaviber from "../layout/IsNotLoginNaviber.tsx";
import { Logo } from "../layout/Logo.tsx";
import styled from "styled-components";
import { UserContext } from "../../provider/UserProvider.tsx";

const Snaviberwrap = styled.div`
  height: 50px;
  width: 100%;
`;

const NotFindPage = () => {
  const { isLogin } = useContext(UserContext);
  return (
    <div style={{ backgroundColor: "#f5f5f7", height: "100vh" }}>
      <Snaviberwrap>
        <Logo />
        {isLogin ? <IsLoginNaviber /> : <IsNotLoginNaviber />}
      </Snaviberwrap>
      <p>指定したユーザーが見つかりませんでした。</p>
    </div>
  );
};

export default NotFindPage;
