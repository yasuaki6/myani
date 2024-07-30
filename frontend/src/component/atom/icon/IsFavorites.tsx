import React, { FC } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";

type Props = {
  fontSize?: string;
};

const IsFavoriteIcon: FC<Props> = (props) => {
  const { fontSize } = props;
  return (
    <FavoriteIcon
      sx={{ color: "pink", fontSize: fontSize && "60px" }}
    ></FavoriteIcon>
  );
};

export default IsFavoriteIcon;
