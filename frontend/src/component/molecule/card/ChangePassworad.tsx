import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import { passwordRegex } from "../../../config.ts";
import useChangePasswordApi from "../../../hooks/user/useChangePasswordApi.ts";

const ChangePassworadCard: React.FC = () => {
  const { changePasswordApi, error, loading } = useChangePasswordApi();

  const [currentPasswordInput, setCurrentPasswordInput] = React.useState("");
  const [newPasswordInput, setNewPasswordInput] = React.useState("");
  const [rePasswordInput, setRePasswordInput] = React.useState("");

  const [formValid, setFormValid] = React.useState("");

  const verifyPassword = (password) => passwordRegex.test(password);

  const handleSubmit = () => {
    setFormValid("");
    if (newPasswordInput !== rePasswordInput) {
      setFormValid("新しいパスワードと確認用パスワードが間違っています。");
      return;
    } else if (verifyPassword(newPasswordInput)) {
      setFormValid("大文字小文字数字を含めてください。");
    } else {
      changePasswordApi({
        currentPassword: currentPasswordInput,
        newPassword: newPasswordInput,
        rePassword: rePasswordInput,
      });
    }
  };

  return (
    <>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          現在のパスワード
        </Typography>
        <Typography component="div">
          <TextField
            margin="normal"
            required
            fullWidth
            id="currentpasswrod"
            label="currentpasswrod"
            name="currentpasswrod"
            autoComplete="currentpasswrod"
            type="password"
            autoFocus
            onChange={(event) => setCurrentPasswordInput(event.target.value)}
          />
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          新しいパスワード
        </Typography>
        <Typography sx={{ mb: 1.5 }} component="div">
          <TextField
            margin="normal"
            required
            fullWidth
            id="passwrod"
            label="passwrod"
            name="passwrod"
            autoComplete="passwrod"
            autoFocus
            type="password"
            onChange={(event) => setNewPasswordInput(event.target.value)}
          />
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          確認パスワード
        </Typography>
        <Typography sx={{ mb: 1.5 }} component="div">
          <TextField
            margin="normal"
            required
            fullWidth
            id="passwrod"
            label="passwrod"
            name="passwrod"
            autoComplete="passwrod"
            autoFocus
            type="password"
            onChange={(event) => setRePasswordInput(event.target.value)}
          />
        </Typography>
        <Grid item xs={12}>
          {formValid && <Alert severity="error">{formValid}</Alert>}
          {error && (
            <Alert severity="error">{"パスワードが間違っています。"}</Alert>
          )}
        </Grid>
        <CardActions style={{ justifyContent: "flex-end" }}>
          <Button size="small" disabled={loading} onClick={handleSubmit}>
            送信
          </Button>
        </CardActions>
      </CardContent>
    </>
  );
};

export default ChangePassworadCard;
