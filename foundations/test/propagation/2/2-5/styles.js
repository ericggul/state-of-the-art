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

  filter: drop-shadow(0 0 0.1rem blue) drop-shadow(0 0 0.2rem red);

  text {
    font-size: 1vw;
    font-family: var(--fira-code);
    dominant-baseline: hanging;
    white-space: pre;
    color: hsla(240, 100%, 90%);
    fill: hsla(240, 100%, 90%);
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
