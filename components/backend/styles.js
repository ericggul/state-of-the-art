import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes } from "styled-components";

const glitchAnimation = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  10% {
    transform: translate(-0.2vw, -0.3vw);
    opacity: 0;
  }
  20% {
    transform: translate(-0.4vw, -0.6vw);
    opacity: 1;
  }
  30% {
    transform: translate(-0.5vw, -0.9vw);
    opacity: 0;
  }
  40% {
    transform: translate(-0.5vw, -1.2vw);
    opacity: 1;
  }
  50% {
    transform: translate(0.2vw, -1.5vw);
    opacity: 0;
  }
  60% {
    transform: translate(0.4vw, -1.8vw);
    opacity: 1;
  }
  70% {
    transform: translate(0.5vw, -2.1vw);
    opacity: 0;
  }
  80% {
    transform: translate(0.4vw, -2.4vw);
    opacity: 1;
  }
  90% {
    transform: translate(0.2vw, -2.7vw);
    opacity: 0;
  }
  100% {
    transform: translate(0, -3vw);
    opacity: 1;
  }
`;

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  position: relative;
  animation: ${({ $glitchEffect }) =>
      $glitchEffect ? glitchAnimation : "none"}
    0.1s linear infinite;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    opacity: ${({ $glitchEffect }) => ($glitchEffect ? 0.5 : 0)};
    z-index: -1;
    pointer-events: none;
  }

  &::before {
    left: 0.2vw;
    background: cyan;
    mix-blend-mode: multiply;
    animation: ${({ $glitchEffect }) =>
        $glitchEffect ? glitchAnimation : "none"}
      0.1s linear infinite reverse;
  }

  &::after {
    left: -0.2vw;
    background: red;
    mix-blend-mode: screen;
    animation: ${({ $glitchEffect }) =>
        $glitchEffect ? glitchAnimation : "none"}
      0.1s linear infinite;
  }
`;
