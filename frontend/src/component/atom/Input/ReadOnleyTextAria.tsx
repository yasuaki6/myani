import * as React from "react";
import { Input as BaseInput } from "@mui/base/Input";
import { styled } from "@mui/system";

const Input = React.forwardRef(function CustomInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return <BaseInput slots={{ input: InputElement }} {...props} ref={ref} />;
});

type Props = {
  value: string;
};

export const ReadOnlyTextAria = React.forwardRef((props: Props) => {
  const { value } = props;

  return <Input readOnly={true} aria-label="Demo input" placeholder={value} />;
});

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const InputElement = styled("input")(
  ({ theme }) => `
  width: 70%;
  height: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border:none;

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);
