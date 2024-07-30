import styled from "styled-components";
import React from "react";

const Swrap = styled.div<{
  $fontSize: string;
  $backgroundColor?: string;
}>`
  font-size: ${({ $fontSize }) => `${$fontSize}`};
  background-color: ${({ $backgroundColor }) => `${$backgroundColor}`};
`;

const STitleText = styled.h1`
  font-family: "Rock Salt", cursive;
  display: flex;
  justify-content: center;
  margin: 0;
`;

const SColoredSpan = styled.span<{
  $color: string;
  $padding: string;
  $margin: string;
}>`
  color: ${({ $color }) => `${$color}`};
  padding: ${({ $padding }) => `${$padding}`};
  margin: ${({ $margin }) => `${$margin}`};
`;

type Props = {
  fontsize: string;
  margin?: string;
  padding?: string;
  backgroundcolor?: string;
  colors?: Array<string>;
};

const defaultColors = [
  "red",
  "orange",
  "#FFD000",
  "green",
  "blue",
  "indigo",
  "violet",
];

const text = "MYANI";

const Title = (props: Props) => {
  const { fontsize, padding, margin, backgroundcolor, colors } = props;

  return (
    <Swrap
      $fontSize={fontsize}
      $backgroundColor={backgroundcolor && backgroundcolor}
    >
      <STitleText>
        {text.split("").map((char, index) => (
          <SColoredSpan
            key={index}
            $padding={padding ? padding : "5%"}
            $color={
              colors
                ? colors[index % colors.length]
                : defaultColors[index % defaultColors.length]
            }
            $margin={margin ? margin : "0"}
          >
            {char}
          </SColoredSpan>
        ))}
      </STitleText>
    </Swrap>
  );
};
export default Title;
