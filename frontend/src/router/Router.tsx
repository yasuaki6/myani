import React from "react";
import MainPage from "../component/pages/Home.tsx";
import SignIn from "../component/pages/SignIn.tsx";
import SignUp from "../component/pages/SignUp.tsx";
import MyFavorites from "../component/pages/MyFovorites.tsx";
import { createBrowserRouter } from "react-router-dom";
import AccountSetting from "../component/pages/AccountSettings.tsx";
import ChangePasswrodPage from "../component/pages/ChangePasswordPage.tsx";
import CheckPassword from "../component/pages/CheckPasswordPage.tsx";
import NotFindPage from "../component/pages/NotfindPage.tsx";
import { TokenChackPage } from "../component/pages/TokenChackPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/favorite-anime/:username/:identifier",
    element: <MyFavorites />,
  },
  {
    path: "/setting",
    element: <AccountSetting />,
  },
  {
    path: "/changepassword",
    element: <ChangePasswrodPage />,
  },
  {
    path: "/passwordcheck",
    element: <CheckPassword />,
  },
  {
    path: "/notfind",
    element: <NotFindPage />,
  },
  {
    path: "/tokenchack/:token/",
    element: <TokenChackPage />,
  },
]);
