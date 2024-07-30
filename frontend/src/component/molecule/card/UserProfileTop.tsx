import styled from "styled-components";
import ModeIcon from "@mui/icons-material/Mode";
import { TextAria } from "../../atom/Input/Textaria.tsx";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ReadOnlyTextAria } from "../../atom/Input/ReadOnleyTextAria.tsx";
import { UserContext } from "../../../provider/UserProvider.tsx";
import UserProfileBackground from "../userprofile/UserProfileBackground.tsx";
import UserAvatar from "../icon/UserAvatar.tsx";
import useEditUserProfile from "../../../hooks/user/useEditUserProfile.ts";
import { UserProfileContext } from "../../../provider/UserProfileProvider.tsx";
import useGetUserProfile from "../../../hooks/user/useGetUserProfile.ts";
import useUserDetailApi from "../../../hooks/user/useUserDetail.ts";

type Props = {
  icon?: string;
  userProfileBackground?: string;
  isAdmin: boolean;
  status: string;
  username: string;
};

type EditUserprofileProps = {
  icon: string;
  background: string;
  status: string;
};

const SIconWrap = styled.div`
  position: absolute;
  display: inline-block;
  overflow: hidden;
  width: 100px; // 画像の幅
  height: 100px; // 画像の高さ
  z-index: 1;
  top: 11rem;
  left: 2rem;
`;

const SStatusArea = styled.div`
  position: relative;
  left: 150px;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const SStatusAreaTitle = styled.h1`
  font-size: 1rem;
  display: inline-block;
`;

const UserProfileTop: React.FC<Props> = (props) => {
  const { isAdmin, icon, userProfileBackground, status, username } = props;
  const { userInfo, setUserInfo } = React.useContext(UserContext);
  const { userProfileReloadFlag } = React.useContext(UserProfileContext);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const { editUserProfile } = useEditUserProfile();
  const [imgPath, setimgPath] = React.useState<string | undefined>("");
  const [backgroundPath, setBackgroundPath] = React.useState<
    string | undefined
  >("");
  const isFirstRender = React.useRef(true);
  const { getUserProfile, response } = useGetUserProfile();
  const { userDetailApi } = useUserDetailApi();
  const [tmpIcon, setTmpIcon] = React.useState("");
  const [tmpBackground, setTmpBackground] = React.useState("");

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setimgPath(icon);
      setBackgroundPath(userProfileBackground);
    } else {
      if (imgPath) {
        setimgPath(`${icon ? icon : tmpIcon}?version=${Date.now()}`);
      }
      if (backgroundPath) {
        setBackgroundPath(
          `${
            userProfileBackground ? userProfileBackground : tmpBackground
          }?version=${Date.now()}`
        );
      }
      if (!imgPath || !backgroundPath) {
        getUserProfile({
          username: `${userInfo?.username}#${userInfo?.identifier}`,
        });
      }
    }
  }, [userProfileReloadFlag]);

  React.useEffect(() => {
    if (!imgPath && response.icon) {
      setimgPath(response.icon);
      setTmpIcon(response.icon);
      setUserInfo({});
      userDetailApi();
    }
    if (!backgroundPath && response.background) {
      setBackgroundPath(response.background);
      setTmpBackground(response.background);
    }
  }, [response]);

  const handleModeIcon = () => {
    setIsDisabled(false);
  };

  const editUserProfileFnc = (props: EditUserprofileProps) => {
    editUserProfile(props);
  };

  return (
    <Card sx={{ maxWidth: "100%" }}>
      <UserProfileBackground
        image={
          backgroundPath
            ? backgroundPath
            : userProfileBackground && userProfileBackground
        }
        isAdmin={isAdmin}
      />
      <CardContent sx={{ height: "50%" }}>
        <SIconWrap>
          <UserAvatar
            icon={imgPath ? imgPath : icon && icon}
            isAdmin={isAdmin}
          />
          <Typography>{`${username}`}</Typography>
        </SIconWrap>
        <SStatusArea>
          <SStatusAreaTitle>ステータスメッセージ</SStatusAreaTitle>
          {isAdmin && (
            <ModeIcon
              sx={{ fontSize: "1rem" }}
              onClick={handleModeIcon}
            ></ModeIcon>
          )}
          {isDisabled ? (
            <ReadOnlyTextAria value={status} />
          ) : (
            <TextAria
              disabled={isDisabled}
              value={status}
              callBackFnc={editUserProfileFnc}
            />
          )}
        </SStatusArea>
      </CardContent>
    </Card>
  );
};

export default UserProfileTop;
