import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import UserIconUseUserEditSelectBox from "../molecule/UserIconUseUserEditSelectBox.tsx";
import SearchInput from "../atom/Input/Search.tsx";
import { useContext } from "react";
import { UserContext } from "../../provider/UserProvider.tsx";
import { Link as RouterLink } from "react-router-dom";
import useWindowSize from "../../hooks/window.ts";

const Sdiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const SwrapUserIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
`;

const SwrapSearchInput = styled.div`
  position: absolute;
  width: 20vw;
  min-width: 100px;
  top: 7;
  right: 50px;
  margin: 10px;
`;

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

export default function IsLoginNaviber() {
  const { userInfo } = useContext(UserContext);
  const { windowSize, handleResize } = useWindowSize();

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Sdiv role="presentation" onClick={handleClick}>
      {windowSize.width >= 600 && (
        <>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={"/"}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              MYANI
            </Link>
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={`/favorite-anime/${userInfo?.username}/${userInfo?.identifier}`}
            >
              お気に入り
            </Link>
          </Breadcrumbs>
        </>
      )}
      <SwrapUserIcon>
        <UserIconUseUserEditSelectBox />
      </SwrapUserIcon>
      <SwrapSearchInput>
        <SearchInput />
      </SwrapSearchInput>
    </Sdiv>
  );
}
