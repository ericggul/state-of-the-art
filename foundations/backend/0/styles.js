import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes, css } from "styled-components";

const flicker = keyframes`
  0% { background: black; }
  49% { background: black; }
  50% { background: white; }
  99% { background: white; }
  100% { background: black; }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${WholeContainer}
  ${FlexCenterStyle}
  position: relative;

  font-size: 1vw;
  color: #fff;

  background: ${({ $isblack, $isTransparent }) =>
    $isTransparent ? "transparent" : $isblack ? "black" : "white"};

  svg {
    stroke: ${({ $isblack }) => ($isblack ? "white" : "black")};
  }
  div {
    color: ${({ $isblack }) => ($isblack ? "white" : "black")};
  }
`;

export const MidRow = styled.div`
  ${FlexCenterStyle}
`;

export const Pic = styled.svg`
  ${WholeContainer}

  path {
    transition: 0.4s linear;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;

export const Tokens = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Token = styled.div`
  position: absolute;
  font-size: 0.8vw;
  font-weight: 500;
  width: 5vw;

  ${FlexCenterStyle}
  text-align: center;
  flex-direction: column;
`;

export const Inner = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  // transition: all 0.1s;
  // transition-delay: 0.2s;
`;
