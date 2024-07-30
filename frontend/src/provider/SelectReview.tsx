import React, {
  ReactNode,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

import { ReviewDataType } from "../types/api/review.ts";

type SelectReviewContextType = {
  reviewsData: {} | ReviewDataType;
  reviewReloadFlag: boolean;
  setReviewReloadFlag: Dispatch<SetStateAction<boolean>>;
  setReviewsData: Dispatch<SetStateAction<{} | ReviewDataType>>;
};

export const SelectReviewContext = createContext<SelectReviewContextType>(
  {} as SelectReviewContextType
);

export const SelectReviewProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [reviewsData, setReviewsData] = useState<ReviewDataType | {}>({});
  const [reviewReloadFlag, setReviewReloadFlag] = useState(false);

  return (
    <SelectReviewContext.Provider
      value={{
        reviewsData,
        reviewReloadFlag,
        setReviewReloadFlag,
        setReviewsData,
      }}
    >
      {children}
    </SelectReviewContext.Provider>
  );
};
