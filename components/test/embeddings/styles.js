import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  background: #111;
  color: white;
`;

export const Col = styled.div`
  h1 {
    font-size: 1.5rem;
  }
  p {
    font-size: 0.5rem;
  }
`;

export const TextInput = styled.input`
  z-index: 2;
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
