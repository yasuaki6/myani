import React, { FC, useContext, useEffect, memo, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../../../provider/UserProvider.tsx";
import ReviewCard from "../card/ReviewCrad.tsx";
import StickyReviewForm from "../../atom/form/ReviewForm.tsx";
import { SelectReviewContext } from "../../../provider/SelectReview.tsx";
import Loading from "../../atom/progress/Loading.tsx";
import useRandomGetReviewApi from "../../../hooks/review/useRandomGetReviewApi.ts";

type Props = {
  username?: string;
  reviews?: [];
  animeTitle: string;
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90%, 1fr));
  grid-template-rows: repeat(auto-fit, 200px);
  gap: 3rem; // 列間の間隔を設定
  justify-items: center;
  padding: 10px;
`;

const STextArea = styled.div`
  position: relative;
  top: 2.5rem;
  font-size: 1rem;
  color: #f1f1f1;
  letter-spacing: 0.1rem;
  background-color: rgba(43, 43, 43);
`;

const STitle = styled.h1`
  margin: 0px;
  padding-top: 50px;
  padding-left: 1rem;
`;

export const ModalReviewCard: FC<Props> = memo((props) => {
  const { userInfo, isLogin } = useContext(UserContext);
  const { animeTitle } = props;
  const { reviewsData, reviewReloadFlag } = useContext(SelectReviewContext);
  const { randomGetReviewApi, loading } = useRandomGetReviewApi();

  useEffect(() => {
    randomGetReviewApi({ data: { anime_title: animeTitle, number: 10 } });
  }, [reviewReloadFlag]);

  return (
    <STextArea>
      <STitle>レビュー</STitle>
      {loading ? (
        <Loading />
      ) : (
        <Grid>
          {Object.keys(reviewsData).length !== 0 ? (
            Object.keys(reviewsData).map((key, index) => (
              <ReviewCard
                key={index}
                author={key}
                data={reviewsData[key]}
                animeTitle={animeTitle}
              ></ReviewCard>
            ))
          ) : (
            <p style={{ color: "white" }}>レビューはありません</p>
          )}
        </Grid>
      )}
      {isLogin && (
        <StickyReviewForm
          sx={{ button: "10px" }}
          animeTitle={animeTitle}
          author={`${userInfo?.username}#${userInfo?.identifier}`}
        />
      )}
    </STextArea>
  );
});

export default ModalReviewCard;
