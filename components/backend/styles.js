import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes, css } from "styled-components";

// Mondrian's color palette
const MONDRIAN_COLORS = {
  RED: "#DD0100",
  BLUE: "#0000D3",
  YELLOW: "#FAFA00",
  GREEN: "#006B54", // More muted, darker green that matches Mondrian's style
  BLACK: "#000000",
  WHITE: "#FFFFFF",
};
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

  // background: ${({ $isblack }) => ($isblack ? "black" : "white")};
  background: transparent;
`;

export const Top = styled.div`
  ${WholeContainer}
  mix-blend-mode: difference;
  z-index: 100;
  pointer-events: none;

  background: ${({ $deviceIndex }) =>
    $deviceIndex == 0
      ? MONDRIAN_COLORS.RED
      : $deviceIndex == 1
      ? MONDRIAN_COLORS.GREEN
      : $deviceIndex == 2
      ? MONDRIAN_COLORS.BLUE
      : "transparent"};
`;

export const TopOld = styled.div`
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
