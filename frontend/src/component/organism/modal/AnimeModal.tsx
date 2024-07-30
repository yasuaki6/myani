import React, { useEffect, useState, memo } from "react";
import Modal from "@mui/joy/Modal";
import AnimeModalTop from "../../molecule/modal/AnimeModalTop.tsx";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import AnimeModalBody from "../../molecule/modal/AnimeModalBody.tsx";
import useWindowSize from "../../../hooks/window.ts";

type Props = {
  img: string;
  title: string;
  overview: string;
  broadcast?: string;
  is_open: boolean;
  username?: string;
  apiType: "RANDOM" | "DETAIL";
  handleClose: () => void;
};

export const AnimeModal = memo((props: Props) => {
  const {
    img,
    title,
    overview,
    is_open,
    broadcast,
    handleClose,
    username,
    apiType,
  } = props;

  const { windowSize, handleResize } = useWindowSize();
  const [additionalStyles, setAdditionalStyles] = useState(
    windowSize.width > 876 ? { paddingTop: "10px" } : { paddingTop: "0px" }
  );

  useEffect(() => {
    setAdditionalStyles(
      windowSize.width > 876 ? { paddingTop: "10px" } : { paddingTop: "0px" }
    );
  }, [windowSize]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={is_open}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          ...additionalStyles,
        }}
      >
        {windowSize.width > 876 ? (
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 876,
              borderRadius: "md",
              boxShadow: "lg",
              border: 0,
            }}
          >
            <ModalClose />

            <AnimeModalTop img={img} title={title}></AnimeModalTop>
            <AnimeModalBody
              animeTitle={title}
              overview={overview}
              broadcast={broadcast}
              username={username}
              apiType={apiType}
            />
          </Sheet>
        ) : (
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: "100%",
              borderRadius: "md",
              boxShadow: "lg",
              border: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <ModalClose />
            <AnimeModalTop img={img} title={title}></AnimeModalTop>
            <AnimeModalBody
              animeTitle={title}
              overview={overview}
              broadcast={broadcast}
              username={username}
              apiType={apiType}
            />
          </Sheet>
        )}
      </Modal>
    </>
  );
});

export default AnimeModal;
