import styled, { keyframes } from "styled-components";
import { FlexCenterStyle } from "@/styles";

const fadeInScale = keyframes`
  from {
    opacity: 1;
    transform: scale(0.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeInSlide = keyframes`
  from {
    opacity: 1;
    transform: translateY(-1vw);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;
  width: calc(100% - 2.4vw);
  height: calc(100% - 2.4vw);

  padding: 1.2vw;
`;

export const Layer = styled.div`
  width: 12vw;
  height: 3vw;
  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.5) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.5) 100%
  );
  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1vw;
  color: hsla(${(props) => props.$hue}, 15%, 98%, 1);
  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );
  box-shadow: 0 0 1.5vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1),
    inset 0 0 3vw hsla(${(props) => props.$hue}, 30%, 50%, 0.08);
  transition: all 0.3s ease-in-out;
  animation: ${fadeInScale} 0.3s ease-out;
  will-change: transform, opacity;
`;

export const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 0.5vw solid transparent;
  border-right: 0.5vw solid transparent;
  border-top: 0.8vw solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  filter: drop-shadow(0 0 0.8vw hsla(${(props) => props.$hue}, 100%, 75%, 0.2));
  transition: all 0.3s ease-in-out;
  animation: ${fadeInSlide} 0.3s ease-out;
  will-change: transform, opacity;
`;
