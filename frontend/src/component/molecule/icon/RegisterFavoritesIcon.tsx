import React, { FC } from "react";
import NotIsFavoriteIcon from "../../atom/icon/NotIsFavorites.tsx";
import { useRegistrationFavoritesApi } from "../../../hooks/favorite/useRegistrationFavoritesApi.ts";
import IconButton from "@mui/joy/IconButton";

type Props = {
  fontSize?: string;
  title: string;
  setIsFavorite?: (value: boolean) => void;
};

const RegisterFavoritesIcon: FC<Props> = (props) => {
  const { registrationFavoritesApi } = useRegistrationFavoritesApi();
  const { fontSize, title, setIsFavorite } = props;

  const onClickHandler = () => {
    registrationFavoritesApi({ title: title });
    if (setIsFavorite) {
      setIsFavorite(true);
    }
  };

  return (
    <IconButton onClick={onClickHandler} variant="solid">
      <NotIsFavoriteIcon
        fontSize={fontSize ? fontSize : undefined}
      ></NotIsFavoriteIcon>
    </IconButton>
  );
};

export default RegisterFavoritesIcon;
