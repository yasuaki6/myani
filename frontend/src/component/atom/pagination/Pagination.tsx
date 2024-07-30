import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3", // 白色に設定
    },
    text: {
      primary: "white",
    },
  },
});

type Props = {
  count: number;
  callbackFnc: (pageNumber: number) => void;
};

export default function BasicPagination(props: Props) {
  const { count, callbackFnc } = props;

  const handleChange = (event, value: number) => {
    callbackFnc(value);
    window.scrollTo(0, 0);
  };

  return (
    <Stack spacing={2}>
      <ThemeProvider theme={theme}>
        <Pagination count={count} color="primary" onChange={handleChange} />
      </ThemeProvider>
    </Stack>
  );
}
