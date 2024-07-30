import React, { FC } from "react";
import IsFavoriteIcon from "../../atom/icon/IsFavorites.tsx";
import useDeleteFavoritesApi from "../../../hooks/favorite/useDeleteFavoritesApi.ts";
import IconButton from "@mui/joy/IconButton";

type Props = {
  fontSize?: string;
  title: string;
  setIsFavorite?: (value: boolean) => void;
};

const DeleteFavoritesIcon: FC<Props> = (props) => {
  const { deleteFavoritesApi } = useDeleteFavoritesApi();
  const { fontSize, title, setIsFavorite } = props;

  const onClickHandler = () => {
    deleteFavoritesApi({ title: title });
    if (setIsFavorite) {
      setIsFavorite(false);
    }
  };

  return (
    <IconButton onClick={onClickHandler} variant="solid">
      <IsFavoriteIcon
        fontSize={fontSize ? fontSize : undefined}
      ></IsFavoriteIcon>
    </IconButton>
  );
};

export default DeleteFavoritesIcon;
