import React, { FC } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

type Props = {
  fontSize?: string;
};

const NotIsFavoriteIcon: FC<Props> = (props) => {
  const { fontSize } = props;
  return (
    <FavoriteBorderIcon
      sx={{ color: "pink", fontSize: fontSize && "60px", borderWidth: "2px" }}
    ></FavoriteBorderIcon>
  );
};

export default NotIsFavoriteIcon;
