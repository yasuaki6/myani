import React, { useState } from "react";
import CustomFileUploadIcon from "../../atom/icon/CustomFileUploadIcon.tsx";
import UserIcon from "../../atom/icon/UserIcon.tsx";
import styled from "styled-components";

const CustomFileUploadIconWrap = styled.div`
  width: 25px;
  height: 25px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

type Props = {
  icon?: string;
  isAdmin: boolean;
};

const UserAvatar = (props: Props) => {
  const { icon, isAdmin } = props;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div
      style={{ position: "relative", height: "5rem", width: "5rem" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <UserIcon src={icon} sx={{ height: "5rem", width: "5rem" }} />
      {isAdmin && isHovered && (
        <CustomFileUploadIconWrap
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CustomFileUploadIcon fileType="icon" />
        </CustomFileUploadIconWrap>
      )}
    </div>
  );
};
export default UserAvatar;
