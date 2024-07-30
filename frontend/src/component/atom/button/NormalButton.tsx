import React, { FC } from "react";
import Button from "@mui/material/Button";

type Props = {
  children: string;
  disabled?: boolean;
  callBackFnc?: () => void;
};

const NormalButton: FC<Props> = (props) => {
  const { children, disabled = false, callBackFnc } = props;
  return (
    <>
      <Button disabled={disabled} variant="contained" onClick={callBackFnc}>
        {children}
      </Button>
    </>
  );
};

export default NormalButton;
