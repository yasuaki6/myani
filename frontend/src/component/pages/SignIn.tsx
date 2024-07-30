import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import useSingInApi from "../../hooks/user/useSingInApi.ts";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import { Logo } from "../layout/Logo.tsx";
import { emailRegex } from "../../config.ts";
import { Link as RouterLink } from "react-router-dom";

function Copyright(props: any) {
  return (
    <>
      <Logo></Logo>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link component={RouterLink} color="inherit" to="/">
          MYANI
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </>
  );
}

const verifyEmail = (email) => emailRegex.test(email);

export default function SignIn() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [emailError, setEmailError] = useState(false);

  const handleEmail = () => {
    if (!verifyEmail(emailInput) || emailInput.length > 320) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError) {
      return;
    }
    SingInApi({ email: emailInput, password: passwordInput });
  };

  const { SingInApi, loginError } = useSingInApi();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={emailError}
            helperText={emailError && "有効なメールアドレスを設定してください"}
            onChange={(event) => setEmailInput(event.target.value)}
            onBlur={handleEmail}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(event) => setPasswordInput(event.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
          </Button>
          <p>
            {loginError && (
              <Alert severity="error">
                メールまたはパスワードを間違えています
              </Alert>
            )}
          </p>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="#" variant="body2">
                パスワードをお忘れの場合
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                {"新規登録はこちら"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
