import React from "react";
import Button from "@mui/joy/Button";
import { Link } from "react-router-dom";

const LoginButton = () => {
  return (
    <>
      <Button
        component={Link}
        to="/login"
        style={{ position: "absolute", top: "0", right: "0", margin: "10px" }}
      >
        ログイン
      </Button>
    </>
  );
};

export default LoginButton;
