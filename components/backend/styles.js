import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes, css } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${WholeContainer}
  ${FlexCenterStyle}

  font-size: 1vw;
  color: #fff;
  cursor: none;

  background: ${({ $isblack }) => ($isblack ? "black" : "white")};
`;

export const Top = styled.div`
  ${WholeContainer}
  mix-blend-mode: difference;
  z-index: 100;
  pointer-events: none;

  background: ${({ $deviceIndex }) =>
    $deviceIndex == 0
      ? "hsl(0, 100%, 50%)"
      : $deviceIndex == 1
      ? "hsl(120, 100%, 50%)"
      : $deviceIndex == 2
      ? "hsl(240, 100%, 50%)"
      : "transparent"};
`;
