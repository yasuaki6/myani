import React, {
  ReactNode,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { UserProfile } from "../types/api/UserProfile.ts";

type UserProfileContextType = {
  userProfile: UserProfile | null;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
  userProfileReloadFlag: boolean;
  setUserProfileReloadFlag: Dispatch<SetStateAction<boolean>>;
};

export const UserProfileContext = createContext<UserProfileContextType>(
  {} as UserProfileContextType
);

export const UserProfileProvider = (props: { children: ReactNode }) => {
  const { children } = props;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProfileReloadFlag, setUserProfileReloadFlag] = useState(false);

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        setUserProfile,
        userProfileReloadFlag,
        setUserProfileReloadFlag,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
