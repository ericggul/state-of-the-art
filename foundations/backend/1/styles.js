import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  font-size: 1vw;
  color: ${({ isblack }) => (isblack ? "white" : "black")};
  background: transparent;
`;

export const Tokens = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Token = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 0.8vw;
  font-weight: 500;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin: 1vw 0;
    font-size: 1vw;
  }
`;

export const Inner = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  transition-delay: 0.2s;
  font-size: 0.6vw;
  line-height: 1.2;
`;

export const Pic = styled.svg`
  ${WholeContainer}
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;

  path {
    transition: 0.4s linear;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;
