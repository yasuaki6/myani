import React, { useState, memo, useContext, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import Rating from "@mui/material/Rating";
import { Input } from "@mui/base/Input";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import styled from "styled-components";
import useCreateReview from "../../../hooks/review/useCreateReviewApi.ts";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import { SelectReviewContext } from "../../../provider/SelectReview.tsx";

interface Props {
  animeTitle: string;
  author: string;
  sx?: {};
}

const SClearIcon = styled.div`
  position: relative;
  right: -820px;
`;

export const ReviewForm: React.FC<Props> = memo((props) => {
  const { sx, animeTitle, author } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { createReviewApi, response } = useCreateReview();
  const { setReviewReloadFlag } = useContext(SelectReviewContext);

  const [text, setText] = useState("");
  const [value, setValue] = useState<number | null>(1);
  const [title, setTitle] = useState("");

  const [error, setError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    if (response?.status === 201) {
      setReviewReloadFlag((prevFlag) => !prevFlag);
    }
  }, [response]);

  const handleSave = () => {
    setError(false);
    setValidationMessage("");
    if (title.length < 1 || title.length > 32) {
      setError(true);
      setValidationMessage("タイトルを一文字以上32文字までにしてください");
      return;
    } else if (text.length < 1 || text.length > 1024) {
      setError(true);
      setValidationMessage("文章は一文字以上1024文字までにしてください");
      return;
    } else {
      createReviewApi({
        data: {
          anime_title: animeTitle,
          author: author,
          review_title: title,
          body: text,
          star: String(value),
        },
      });
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {isOpen ? (
        <Box
          position="sticky"
          bottom={0}
          bgcolor="background.paper"
          p={2}
          boxShadow={4}
          sx={{ backgroundColor: "rgba(43, 43, 43)", ...{ sx } }}
        >
          <SClearIcon onClick={handleClose}>
            <ClearIcon />
          </SClearIcon>
          <Typography component="legend" sx={{ color: "white" }}>
            タイトル
          </Typography>
          <Input onChange={(e) => setTitle(e.target.value)} />
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            variant="outlined"
            margin="dense"
            sx={{ backgroundColor: "white" }}
          />
          <Grid item xs={12}>
            {error && <Alert severity="error">{validationMessage}</Alert>}
          </Grid>
          <Button variant="contained" onClick={handleSave}>
            投稿
          </Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            margin: "10px",
          }}
        >
          レビューする
        </Button>
      )}
    </>
  );
});

export default ReviewForm;
