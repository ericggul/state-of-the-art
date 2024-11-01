import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

// Common styles that are reused
const commonTransition = (props) => `${props.$animInterval}ms linear`;

// Base container styles
const baseContainerStyles = `
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  font-size: 1vw;
`;

export const Container = styled.div`
  ${baseContainerStyles}
  ${WholeContainer}
  ${FlexCenterStyle}

  color: #fff;
  background: ${({ isblack }) => (isblack ? "black" : "white")};

  svg {
    stroke: ${({ isblack }) => (isblack ? "white" : "black")};
  }

  div {
    color: ${({ isblack }) => (isblack ? "white" : "black")};
  }
`;

export const Pic = styled.svg`
  ${WholeContainer}

  path {
    transition: ${commonTransition};
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  text {
    transition: ${commonTransition};
    transform-origin: center;
  }
`;

export const Token = styled.div`
  ${FlexCenterStyle}
  position: absolute;
  font-size: 0.8vw;
  font-weight: 500;
  width: 5vw;
  text-align: center;
  flex-direction: column;
`;

export const Inner = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  transition-delay: ${(props) => `${props.$animInterval * 0.5}ms`};
`;
