import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { RouterProvider } from "react-router-dom";
import { router } from "./router/Router.tsx";
import { CookiesProvider } from "react-cookie";
import { LoginUserProvider } from "./provider/UserProvider.tsx";
import { SelectReviewProvider } from "./provider/SelectReview.tsx";
import { UserProfileProvider } from "./provider/UserProfileProvider.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <LoginUserProvider>
        <SelectReviewProvider>
          <UserProfileProvider>
            <RouterProvider router={router} />
          </UserProfileProvider>       
        </SelectReviewProvider>
      </LoginUserProvider>
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
