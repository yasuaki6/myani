import React, { FC, useContext } from "react";
import styled from "styled-components";
import { Rating } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { UserContext } from "../../../provider/UserProvider.tsx";
import DeleteIcon from "../../atom/icon/DeleteIcon.tsx";
import useDeleteReview from "../../../hooks/review/useDleteReviewApi.ts";
import { SelectReviewContext } from "../../../provider/SelectReview.tsx";

type Props = {
  author: string;
  data: {
    title: string;
    body: string;
    star: number;
  };
  animeTitle: string;
};

const SDeleteIConWrap = styled.div`
  position: absolute;
  display: inline;
  right: 20px;
`;

const ReviewCard: FC<Props> = (props) => {
  const { data, author, animeTitle } = props;
  const { isLogin, userInfo } = useContext(UserContext);
  const { deleteReviewApi } = useDeleteReview();
  const { setReviewReloadFlag } = useContext(SelectReviewContext);

  const handleDeleteIcon = () => {
    deleteReviewApi({ data: { anime_title: animeTitle, author: author } });
    setReviewReloadFlag((prevFlag) => !prevFlag);
  };

  return (
    <Card sx={{ minWidth: "100%", backgroundColor: "black", color: "white" }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14, margin: "0px 4px" }}
          variant="h2"
          component="div"
        >
          {author}
          {isLogin &&
            author ===
              `${userInfo?.username ?? ""}#${userInfo?.identifier ?? ""}` && (
              <SDeleteIConWrap onClick={handleDeleteIcon}>
                <DeleteIcon />
              </SDeleteIConWrap>
            )}
        </Typography>
        <Typography
          sx={{ padding: 0, fontSize: 18 }}
          variant="h1"
          component="div"
          style={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <div style={{ display: "inline-block", margin: "0 5px" }}>
            {data["title"]}
          </div>
          <Rating name="read-only" value={data["star"]} readOnly size="small" />
        </Typography>
        <Typography
          sx={{ mb: 1.5, margin: "0px 4px" }}
          color="white"
          component="p"
        >
          {data["body"]}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
