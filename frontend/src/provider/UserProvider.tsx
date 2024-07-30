import React, {
  ReactNode,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { UserInfo } from "../types/api/userInfo";

type LoginUserContextType = {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  userInfo: UserInfo | null;
  setUserInfo: Dispatch<SetStateAction<UserInfo | null>>;
};

export const UserContext = createContext<LoginUserContextType>(
  {} as LoginUserContextType
);

export const LoginUserProvider = (props: { children: ReactNode }) => {
  const { children } = props;

  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  return (
    <UserContext.Provider
      value={{ isLogin, setIsLogin, userInfo, setUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};
