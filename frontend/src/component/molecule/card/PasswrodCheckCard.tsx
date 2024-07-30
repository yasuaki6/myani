import * as React from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import useCheckPasswordApi from "../../../hooks/user/useCheckPassword.ts";

const PassworadCheckCard: React.FC = () => {
  const [passwordInput, setPasswordInput] = React.useState("");
  const { checkPasswordApi, error, loading } = useCheckPasswordApi();

  const handleSubmit = () => {
    checkPasswordApi({ password: passwordInput });
  };

  return (
    <>
      <CardContent>
        <Typography
          variant="h1"
          sx={{ fontSize: 32 }}
          color="text.secondary"
          gutterBottom
        >
          パスワードの確認
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          現在のパスワード
        </Typography>
        <Typography component="div">
          <TextField
            margin="normal"
            required
            fullWidth
            id="passwrod"
            label="passwrod"
            name="passwrod"
            autoComplete="passwrod"
            type="password"
            autoFocus
            error={error}
            helperText={error && "パスワードが間違っています。"}
            onChange={(event) => setPasswordInput(event.target.value)}
          />
        </Typography>
        <CardActions style={{ justifyContent: "flex-end" }}>
          <Button size="small" onClick={handleSubmit} disabled={loading}>
            送信
          </Button>
        </CardActions>
      </CardContent>
    </>
  );
};

export default PassworadCheckCard;
