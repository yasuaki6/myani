import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { UserContext } from "../../../provider/UserProvider.tsx";
import NormalButton from "../../atom/button/NormalButton.tsx";
import useEditUserInfoApi from "../../../hooks/user/useEditUserInfo.ts";
import useResendVerificationEmail from "../../../hooks/user/useResendVerificationEmail.ts";
import useDeleteUser from "../../../hooks/user/useDeleteUser.ts";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const SettingCard: React.FC = () => {
  const { userInfo, setUserInfo } = React.useContext(UserContext);
  const [usernameInput, setUsernameInput] = React.useState(userInfo!.username);
  const [identifierInput, setIdentifierInput] = React.useState(
    userInfo!.identifier
  );
  const [mailInput, setMailInput] = React.useState(userInfo!.email);
  const { editUserInfoApi, error, errorMessage, loading } =
    useEditUserInfoApi();
  const { resendVerificationEmail } = useResendVerificationEmail();
  const { deleteUserApi } = useDeleteUser();
  const [open, setOpen] = React.useState(false);

  const [apiType, setApiType] = React.useState("");
  const [usernameError, setUsernameError] = React.useState(false);
  const [identifierError, setIdentifierError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [identifierErrorMessage, setIdentifierErrorMessage] =
    React.useState("");

  const [isDisabled, setIsDisabled] = React.useState(false);
  const callBackFncFroUsernameError = (message) => {
    setUsernameError(true);
    setUsernameErrorMessage(message);
  };

  const callBackFncFroIdentifierError = (message) => {
    setIdentifierError(true);
    setIdentifierErrorMessage(message);
  };

  const handleClickOpenForDialog = () => {
    setOpen(true);
  };

  const handleCloseForDialog = () => {
    setOpen(false);
  };

  const handleDeleteUserButton = () => {
    deleteUserApi();
  };

  const callBackFnc = (type, message) => {
    if (type === "username") {
      callBackFncFroUsernameError(message);
    } else if (type === "identifier") {
      callBackFncFroIdentifierError(message);
    }
  };

  React.useEffect(() => {
    if (error) {
      callBackFnc(apiType, errorMessage);
    } else {
      return;
    }
  }, [error]);

  const onBlurForUsername = () => {
    if (userInfo?.username === usernameInput) {
      return;
    } else {
      if (usernameInput.length > 32 || usernameInput.length < 5) {
        callBackFncFroUsernameError("5文字以上32文字以下に設定してください");
        return;
      } else {
        setUsernameError(false);
        setApiType("username");
        editUserInfoApi({
          username: usernameInput,
          identifier: userInfo!.identifier,
        });
      }
    }
  };

  const onBlurForIdentifier = () => {
    if (userInfo?.identifier === identifierInput) {
      return;
    } else {
      if (identifierInput.length !== 3) {
        callBackFncFroIdentifierError("3桁の数字にしてください");
      } else {
        setIdentifierError(false);
        setApiType("identifier");
        editUserInfoApi({
          username: userInfo!.username,
          identifier: identifierInput,
        });
      }
    }
  };

  const handleButton = () => {
    setIsDisabled(true);
    resendVerificationEmail();
  };

  return (
    <>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          username
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          id="username"
          label="username"
          name="username"
          autoComplete="username"
          autoFocus
          variant="filled"
          onChange={(event) => setUsernameInput(event.target.value)}
          defaultValue={usernameInput}
          error={usernameError}
          helperText={usernameError && usernameErrorMessage}
          onBlur={onBlurForUsername}
        />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          identifier
        </Typography>
        <Typography sx={{ mb: 1.5 }} component="div">
          <TextField
            margin="normal"
            fullWidth
            id="identifier"
            label="identifier"
            name="identifier"
            autoComplete="identifier"
            type="number"
            autoFocus
            variant="filled"
            onChange={(event) => setIdentifierInput(event.target.value)}
            defaultValue={identifierInput}
            error={identifierError}
            helperText={identifierError && identifierErrorMessage}
            onBlur={onBlurForIdentifier}
          />
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {userInfo!.is_email_verified ? "mail認証済み" : "mail未認証"}
          {!userInfo!.is_email_verified && (
            <div
              style={{ display: "inline-block", padding: "0px 20px" }}
              onClick={handleButton}
            >
              <NormalButton disabled={isDisabled}>
                {isDisabled ? "送信済み" : "認証メールを送信"}
              </NormalButton>
            </div>
          )}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          現在のメールアドレス
        </Typography>
        <Typography sx={{ mb: 1.5 }} component="div">
          <TextField
            margin="normal"
            fullWidth
            id="mail"
            onChange={(event) => setMailInput(event.target.value)}
            InputProps={{
              readOnly: true,
            }}
            defaultValue={mailInput}
          />
        </Typography>
        <Typography
          sx={{ display: "flex", justifyContent: "end" }}
          component="div"
        >
          <NormalButton callBackFnc={handleClickOpenForDialog}>
            退会
          </NormalButton>
        </Typography>
        <Dialog
          open={open}
          onClose={handleCloseForDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              一度退会すると、データは削除され、戻すことができません。
              もう一度、ご利用になられる際は再登録をお願いします。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteUserButton}>退会する</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </>
  );
};

export default SettingCard;
