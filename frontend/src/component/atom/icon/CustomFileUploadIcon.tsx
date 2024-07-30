import React, { useRef, FC } from "react";
import styled from "styled-components";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import useEditUserProfile from "../../../hooks/user/useEditUserProfile.ts";

const Input = styled.input`
  display: none;
`;

type Props = {
  fileType: "icon" | "background";
};

const CustomFileUploadIcon: FC<Props> = (props) => {
  const { fileType } = props;
  const fileInputRef = useRef(null);
  const { editUserProfile } = useEditUserProfile();

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (fileType === "background") {
      editUserProfile({ background: selectedFile });
    } else if (fileType === "icon") {
      editUserProfile({ icon: selectedFile });
    }
  };

  return (
    <>
      <Input
        type="File"
        accept="image/*"
        name="image"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div onClick={handleIconClick}>
        <FileUploadIcon sx={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
};

export default CustomFileUploadIcon;
