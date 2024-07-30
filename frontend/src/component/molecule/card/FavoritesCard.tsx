import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
type Props = {
  title: string;
  overview?: string;
  img?: string;
  broadcast?: string;
  height?: string;
  width?: string;
  callBackFnc: (title: string) => void;
};

export default function FavoriteCard(props: Props) {
  const { img, height, width, title, callBackFnc } = props;

  const handleCard = () => {
    callBackFnc(title);
  };

  return (
    <Card
      onClick={handleCard}
      sx={{
        height: height,
        width: width,
        backgroundColor: "#292836",
        boxShadow: "none",
      }}
    >
      <CardMedia
        sx={{
          height: "80%",
          width: "90%",
          "&:hover": {
            transform: "scale(1.1)",
            transition: "transform 0.7s",
          },
        }}
        image={img}
        title="favorite title"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h1"
          component="div"
          sx={{ fontSize: "1rem", color: "white" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="white"></Typography>
      </CardContent>
    </Card>
  );
}
