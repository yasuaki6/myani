import React, { FC, useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import OverviewCard from "../../atom/card/OverviewCard.tsx";
import ModalReviewCard from "./RandomReviewCard.tsx";

const SBody = styled.div`
  background-color: rgba(29, 29, 29);
  height: 100%;
`;

const SGradientOverlay0 = styled.div`
  position: absolute;
  width: 100%;
  height: 30%;
  background: linear-gradient(
    to top,
    rgba(31, 31, 31, 0) 75%,
    rgba(31, 31, 31, 1)
  );
  opacity: 1;
  pointer-events: none;
  z-index: 1;
`;

const SGradientOverlay1 = styled.div`
  position: absolute;
  height: 2.5rem;
  width: 100%;
  background: linear-gradient(
    to bottom,
    rgba(43, 43, 43, 0) 85%,
    rgba(43, 43, 43, 1)
  );
  opacity: 1;
  z-index: 2;
`;

type Props = {
  animeTitle: string;
  overview: string;
  broadcast?: string;
};

const theme = createTheme({
  palette: {
    custom: {
      main: "rgba(43, 43, 43)",
      light: "rgba(74, 74, 74)",
      dark: "rgba(12, 12, 12)",
      contrastText: "#FFFFFF",
    },
  },
});

const AnimeModalBody: FC<Props> = (props) => {
  const { overview, broadcast, animeTitle } = props;
  const [buttonFlag, setButtonFlag] = useState(false);
  const handleReviewButton = () => {
    setButtonFlag(true);
  };
  const handleOverviewButton = () => {
    setButtonFlag(false);
  };

  return (
    <>
      <SBody>
        <SGradientOverlay0 />
        <SGradientOverlay1 />
        <ThemeProvider theme={theme}>
          <ButtonGroup
            variant="contained"
            aria-label="Basic button group"
            color="custom"
            sx={{
              height: `2.5rem`,
              position: "absolute",
              zIndex: 3,
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: 0 }}
              onClick={handleReviewButton}
              disabled={!buttonFlag}
            >
              レビュー
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{ borderRadius: 0 }}
              onClick={handleOverviewButton}
              disabled={!buttonFlag}
            >
              作品紹介
            </Button>
          </ButtonGroup>
        </ThemeProvider>
        {buttonFlag ? (
          <ModalReviewCard animeTitle={animeTitle} />
        ) : (
          <OverviewCard
            broadcast={broadcast}
            overview={overview}
          ></OverviewCard>
        )}
      </SBody>
    </>
  );
};

export default AnimeModalBody;
