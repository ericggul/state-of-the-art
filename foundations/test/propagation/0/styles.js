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
    font-family: monospace;
    dominant-baseline: hanging;
    white-space: pre;
    color: white;
    fill: white;
  }
`;
