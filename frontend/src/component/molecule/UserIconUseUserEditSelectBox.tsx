import UserIcon from "../atom/icon/UserIcon.tsx";
import React, { useContext, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import useLogoutApi from "../../hooks/user/useLogoutApi.ts";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../provider/UserProvider.tsx";
import { UserProfileContext } from "../../provider/UserProfileProvider.tsx";

const UserIconUseUserEditSelectBox = () => {
  const { logoutApi } = useLogoutApi();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const { userProfile } = useContext(UserProfileContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const toChangingPassword = () => {
    navigate("/changepassword");
  };

  const toPasswordCheck = () => {
    navigate("/passwordcheck");
  };

  const toFavoritePage = () => {
    navigate(`/favorite-anime/${userInfo?.username}/${userInfo?.identifier}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <UserIcon
        aria-controls="user-menu"
        aria-haspopup="true"
        callBackFunc={handleClick}
        src={userProfile?.icon}
      />
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock={true}
      >
        <MenuItem onClick={toFavoritePage}>お気に入り</MenuItem>
        <MenuItem onClick={toPasswordCheck}>アカウント情報の編集</MenuItem>
        <MenuItem onClick={toChangingPassword}>パスワードの変更</MenuItem>
        <MenuItem onClick={logoutApi}>ログアウト</MenuItem>
      </Menu>
    </div>
  );
};

export default UserIconUseUserEditSelectBox;
