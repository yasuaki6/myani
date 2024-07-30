import React, { FC, memo, useState } from "react";
import CustomFileUploadIcon from "../../atom/icon/CustomFileUploadIcon.tsx";
import { CardMedia } from "@mui/material";
import styled from "styled-components";
import CheckFullPath from "../../../functions/CheckFullPass.ts";

const CustomFileUploadIconWrap = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
type Props = {
  image?: string;
  isAdmin: boolean;
};
const UserProfileBackground = (props: Props) => {
  const { image, isAdmin } = props;
  const imagePath = CheckFullPath(image);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div style={{ position: "relative", height: "50%" }}>
      <CardMedia
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          height: "100%",
          objectFit: "fill",
        }}
        component="img"
        image={image ? `${imagePath}` : "/media/userprofile/color_image.png"}
        title="MyBackground"
      />
      {isAdmin && isHovered && (
        <CustomFileUploadIconWrap
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CustomFileUploadIcon fileType="background" />
        </CustomFileUploadIconWrap>
      )}
    </div>
  );
};

export default UserProfileBackground;
