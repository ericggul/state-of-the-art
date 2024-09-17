import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  background: #111;
  color: white;
`;

export const TextGrid = styled.div`
  ${WholeContainer}
`;

export const InnerSVG = styled.svg`
  ${WholeContainer}

  filter: drop-shadow(0 0 0.1rem hsl(180, 100%, 50%));

  text {
    font-size: 1vw;
    font-family: var(--fira-code);
    // font-family: Times New Roman;
    dominant-baseline: hanging;
    white-space: pre;
    fill: hsla(240, 100%, 90%);
    transform-origin: center;
  }
`;

export const Overlay = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  font-size: 40vw;
  color: white;
  mix-blend-mode: difference;
  -webkit-mix-blend-mode: difference;
`;
