import * as React from "react";
import Avatar from "@mui/material/Avatar";
import ChackFullPATH from "../../../functions/CheckFullPass.ts";

type Props = {
  callBackFunc?: (event: any) => void;
  src?: string;
  sx?: { [key: string]: string };
};

const UserIcon: React.FC<Props> = (props) => {
  const { callBackFunc, src, sx } = props;
  const path = ChackFullPATH(src);

  return (
    <>
      {path ? (
        <Avatar src={path} onClick={callBackFunc} sx={sx} />
      ) : (
        <Avatar src="/broken-image.jpg" onClick={callBackFunc} sx={sx} />
      )}
    </>
  );
};

export default UserIcon;
