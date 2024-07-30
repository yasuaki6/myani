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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSingUpApi } from "../../hooks/user/useSingUpApi.ts";
import { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormControl, FormHelperText } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Logo } from "../layout/Logo.tsx";
import { passwordRegex, emailRegex } from "../../config.ts";
import { Link as RouterLink } from "react-router-dom";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link component={RouterLink} color="inherit" to="https://mui.com/">
        MYANI
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const verifyEmail = (email) => emailRegex.test(email);

const verifyPassword = (password) => passwordRegex.test(password);

const defaultTheme = createTheme();

export default function SignUp() {
  // Inputs
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rePasswordInput, setRePasswordInput] = useState("");

  // Input Errors
  const [usernameError, setusernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  //validation for submit
  const [formValid, setFormValid] = useState("");

  //Validation for onBlur Username
  const handleUsername = () => {
    if (
      !usernameInput ||
      usernameInput.length < 5 ||
      usernameInput.length > 32
    ) {
      setusernameError(true);
      return;
    }

    setusernameError(false);
  };

  //Validation for onBlur Email
  const handleEmail = () => {
    if (!verifyEmail(emailInput) || emailInput.length > 320) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
  };

  //Validation for onBlur Password
  const handlePassWord = () => {
    if (
      !verifyPassword(passwordInput) ||
      passwordInput.length < 8 ||
      passwordInput.length > 32
    ) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (usernameError || emailError || passwordError) {
      return;
    }
    if (passwordInput !== rePasswordInput) {
      setFormValid("パスワードが一致しません。");
      return;
    }
    setFormValid("");
    SingUpApi({
      username: usernameInput,
      email: emailInput,
      password: passwordInput,
      repassword: rePasswordInput,
    });
    if (Object.keys(errorMessages).length > 0) {
      setFormValid(errorMessages[0]);
      return;
    }
  };

  const { SingUpApi, loading, errorMessages } = useSingUpApi();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Logo />
      <ThemeProvider theme={defaultTheme}>
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
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="UserName"
                    required
                    fullWidth
                    id="UserName"
                    label="User Name"
                    autoFocus
                    error={usernameError}
                    helperText={
                      usernameError && "5文字以上32文字以下に設定してください"
                    }
                    onChange={(event) => setUsernameInput(event.target.value)}
                    onBlur={handleUsername}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={emailError}
                    helperText={
                      emailError && "有効なメールアドレスを設定してください"
                    }
                    onChange={(event) => setEmailInput(event.target.value)}
                    onBlur={handleEmail}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ width: "100%" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                      error={passwordError}
                      onChange={(event) => setPasswordInput(event.target.value)}
                      onBlur={handlePassWord}
                    />
                    <FormHelperText error>
                      {passwordError &&
                        "大文字小文字数字を含めて8文字以上32文字以下にしてください"}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    name="rePassword"
                    label="repassword"
                    id="rePassword"
                    autoComplete="new-password"
                    onChange={(event) => setRePasswordInput(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  {formValid && <Alert severity="error">{formValid}</Alert>}
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                新規登録
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    {"アカウントをお持ちの場合はこちら"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </>
  );
}
