import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  cursor: none;

  canvas {
    width: 100%;
    height: 100%;
  }
`;

const chaosColorAnimation = keyframes`
  0% { background-color: hsl(${Math.random() * 360}, 100%, 50%); }
  20% { background-color: hsl(${Math.random() * 360}, 100%, 50%); }
  40% { background-color: hsl(${Math.random() * 360}, 100%, 50%); }
  60% { background-color: hsl(${Math.random() * 360}, 100%, 50%); }
  80% { background-color: hsl(${Math.random() * 360}, 100%, 50%); }
  100% { background-color: hsl(${Math.random() * 360}, 100%, 50%); }
`;

export const Overlay = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  mix-blend-mode: difference;
  pointer-events: none;
  animation: ${chaosColorAnimation} 0.03s linear infinite;
`;
