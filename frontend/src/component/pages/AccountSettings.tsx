import React, { useContext, useEffect, useState } from "react";
import { Logo } from "../layout/Logo.tsx";
import IsLoginNaviber from "../layout/IsLoginNaviber.tsx";
import LoginButton from "../atom/button/LoginButton.tsx";
import styled from "styled-components";
import { UserContext } from "../../provider/UserProvider.tsx";
import SettingCard from "../molecule/card/SettingCard.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import useUserDetailApi from "../../hooks/user/useUserDetail.ts";

const SPage = styled.div`
  background-color: #f5f5f7;
  height: 100vh;
`;

const AccountSetting = () => {
  const location = useLocation();
  const isAdmin = location.state && location.state.isAdmin;
  const navigate = useNavigate();
  const { userDetailApi } = useUserDetailApi();

  const { isLogin } = useContext(UserContext);

  const handleBeforeUnload = () => {
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    } else {
      userDetailApi();
    }
  }, []);

  return (
    <SPage>
      <Logo />
      {isLogin ? <IsLoginNaviber /> : <LoginButton />}
      <div style={{ paddingTop: "130px" }}>
        {isAdmin && <SettingCard></SettingCard>}
      </div>
    </SPage>
  );
};

export default AccountSetting;
