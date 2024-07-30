import React from "react";
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
  handleClose: () => void;
};

function AnimeModal(props: Props) {
  const { img, title, overview, is_open, broadcast, handleClose, username } =
    props;

  const { windowSize, handleResize } = useWindowSize();

  React.useEffect(() => {
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
        sx={{ display: "flex", justifyContent: "center", paddingTop: "10px" }}
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
              apiType="DETAIL"
            ></AnimeModalBody>
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
              apiType="DETAIL"
            ></AnimeModalBody>
          </Sheet>
        )}
      </Modal>
    </>
  );
}

export default AnimeModal;
