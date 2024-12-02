import styled from "styled-components";
import { WholeContainer } from "@/styles";

export const LINEWIDTH = 0.1;
export const LEFT = 3;
export const TOP = 4;
export const HEIGHT = 92;

export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
  z-index: 999;
  pointer-events: none;
`;

export const VerticalLine = styled.div`
  position: absolute;
  width: ${LINEWIDTH}vw;
  height: ${HEIGHT}vh;
  top: 0;
  left: ${LEFT}vw;
  background: ${(props) => `hsla(${props.$hue}, 100%, 75%, 0.9)`};
`;

export const HorizontalLine = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: 45vw;
  top: ${TOP}vw;
  left: 0;
  background: ${(props) => `hsla(${props.$hue}, 100%, 75%, 0.9)`};
`;

export const HorizontalLine2 = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: 25vw;
  top: ${TOP}vw;
  left: 50vw;
  background: ${(props) => `hsla(${props.$hue}, 100%, 75%, 0.9)`};

  &::before {
    content: "";
    position: absolute;
    width: 1vw;
    height: 1vw;
    border-radius: 50%;
    background: ${(props) => `hsla(${props.$hue}, 100%, 75%, 1)`};
    top: 0;
    left: -0.5vw;
    transform: translateY(-50%);
  }
`;

export const ModelTitle = styled.div`
  position: absolute;
  // background: ${(props) => `hsla(${props.$hue}, 60%, 15%, 0.5)`};
  color: ${(props) => `hsla(${props.$hue}, 100%, 80%, 1)`};
  left: ${LEFT + 1.5}vw;
  top: ${TOP}vw;
  padding: 0.3vw 1vw;
  transform: translateY(-50%);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 2vw;
`;

export const Title = styled.h1`
  font-size: 3vw;
`;
