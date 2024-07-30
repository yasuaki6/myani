import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

type Props = {
  message?: string;
};

const SuccessAlert: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(true);
  const { message } = props;

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success" // ここを変更
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message ? message : "操作が成功しました。"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SuccessAlert;
