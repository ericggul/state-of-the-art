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

  font-size: 1vw;
  color: #fff;

  background: ${({ $isblack }) => ($isblack ? "black" : "white")};

  svg {
    stroke: ${({ $isblack }) => ($isblack ? "white" : "black")};
  }
  div {
    color: ${({ $isblack }) => ($isblack ? "white" : "black")};
  }
`;

export const Token = styled.div`
  font-size: 1vw;
  font-weight: 500;
  color: white;

  ${FlexCenterStyle}
  text-align: center;
  flex-direction: column;

  position: absolute;

  transform: translate(-50%, -50%);
  transition: all 0.1s;
`;

export const Pic = styled.svg`
  ${WholeContainer}

  path {
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;
