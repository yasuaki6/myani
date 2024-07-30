import React, { useContext, useEffect } from "react";
import { Logo } from "../layout/Logo.tsx";
import IsLoginNaviber from "../layout/IsLoginNaviber.tsx";
import LoginButton from "../atom/button/LoginButton.tsx";
import styled from "styled-components";
import { UserContext } from "../../provider/UserProvider.tsx";
import PassworadCheckCard from "../molecule/card/PasswrodCheckCard.tsx";
import useUserDetailApi from "../../hooks/user/useUserDetail.ts";

const SPage = styled.div`
  background-color: #f5f5f7;
  height: 100vh;
`;

const CheckPassword = () => {
  const { userInfo, isLogin } = useContext(UserContext);
  const { userDetailApi } = useUserDetailApi();

  useEffect(() => {
    if (!isLogin) {
      userDetailApi();
    }
  }, []);

  return (
    <SPage>
      <Logo />
      {isLogin ? <IsLoginNaviber /> : <LoginButton />}
      <div style={{ paddingTop: "130px" }}>
        <PassworadCheckCard></PassworadCheckCard>
      </div>
    </SPage>
  );
};

export default CheckPassword;
