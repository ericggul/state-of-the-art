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

  color: white;

  text {
    font-size: 1vw;
    font-family: var(--fira-code);
    dominant-baseline: hanging;
    white-space: pre;
    color: white;
    fill: white;
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
