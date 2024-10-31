import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${WholeContainer}
  ${FlexCenterStyle}

  font-size: 1vw;
  color: #fff;

  background: ${({ isblack }) => (isblack ? "black" : "white")};
  svg {
    stroke: ${({ isblack }) => (isblack ? "white" : "black")};
  }
  div {
    color: ${({ isblack }) => (isblack ? "white" : "black")};
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
  font-size: 0.8vw;
  font-weight: 500;
  color: white;
  width: 5vw;

  ${FlexCenterStyle}
  text-align: center;
  flex-direction: column;
`;

export const Inner = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  // color: #aaa;

  // transition: 0.2s linear;
  transition-delay: 0.2s;
`;
