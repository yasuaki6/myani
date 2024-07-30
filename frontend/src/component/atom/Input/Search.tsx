import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import useSerchUsername from "../../../hooks/user/useSerchUsename.ts";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  left: "-50px",
}));

const SearchInput = () => {
  const [input, setInput] = useState("");
  const { serchUsername, response } = useSerchUsername();
  const beforeRegex = /(.*)#/;
  const afterRegex = /#(.*)/;
  const navigate = useNavigate();

  const handleNavi = (value: string) => {
    if (value.indexOf("#")) {
      const beforeMatch = value.match(beforeRegex);
      const beforeHashtag = beforeMatch ? beforeMatch[1] : null;
      const afterMatch = value.match(afterRegex);
      const afterHashtag = afterMatch ? afterMatch[1] : null;
      if (beforeHashtag && afterHashtag) {
        navigate(`/favorite-anime/${beforeHashtag}/${afterHashtag}`);
      }
    } else {
      return;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleNavi(input);
    }
  };

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    if (/#/.test(input)) {
      const match = input.match(beforeRegex);
      const beforeHashtag = match ? match[1] : null;
      if (beforeHashtag) {
        serchUsername({ username: beforeHashtag });
      }
    }
  }, [input]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        sx={{
          width: "100%",
        }}
        onChange={(event, value) => {
          handleNavi(value);
        }}
        options={
          Object.keys(response).length !== 0
            ? Object.values(response).map((option) => option)
            : []
        }
        renderInput={(params) => (
          <TextField
            {...params}
            value={input}
            onChange={handleChange}
            placeholder="username#..."
            variant="standard"
            onKeyDown={handleKeyDown}
            InputProps={{
              ...params.InputProps,
              type: "standard",
            }}
          />
        )}
      />
    </Search>
  );
};

export default SearchInput;
