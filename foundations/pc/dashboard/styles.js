import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

import {
  LINEWIDTH,
  LEFT,
  TOP,
  HEIGHT,
} from "@/foundations/pc/frame/full/styles";

import { shadowPulse } from "../styles/animations";

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

export const Container = styled.div`
  ${WholeContainer}
  background: hsl(${(props) => props.$hue}, 8%, 4%);
  background: linear-gradient(
    135deg,
    hsl(${(props) => props.$hue}, 8%, 4%) 0%,
    hsl(${(props) => props.$hue}, 12%, 2%) 100%
  );
  padding: 4vw;
  cursor: none;
  padding-top: 6vw;
  --hue: ${({ $hue }) => $hue};
  animation: ${shadowPulse} 4s ease-in-out infinite;
`;

export const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${100 - LEFT * 3}vw;
  height: ${HEIGHT - TOP * 3}vh;
  top: ${TOP * 3}vh;
  left: ${LEFT * 2}vw;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 30vh;
  margin-top: 10vh;
  gap: 1.5vw;
`;

export const CardWrapper = styled.div`
  position: relative;
  height: 100%;
`;

export const Card = styled.div`
  position: relative;
  height: 100%;
  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.5) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.5) 100%
  );
  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);

  backdrop-filter: blur(0.6vw);
  -webkit-backdrop-filter: blur(0.6vw);

  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
      transparent
    );
    animation: ${scanline} 2s linear infinite;
    opacity: 0.5;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      hsla(${(props) => props.$hue}, 40%, 100%, 0.03) 0%,
      transparent 50%
    );
    pointer-events: none;
  }

  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 1.5vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1),
    inset 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.05);

  &:hover {
    border-color: hsla(${(props) => props.$hue}, 100%, 75%, 0.4);
    box-shadow: 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
      inset 0 0 3vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1);
  }
`;

export const CardTitle = styled.h3`
  position: absolute;
  font-size: 1.2vw;
  font-weight: 500;
  left: 0;
  top: -2.5vw;
  margin: 0;
  padding: 0;
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.9);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2),
    0 0.1vw 0.2vw hsla(0, 0%, 0%, 0.3);
  z-index: 2;
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: hsla(${(props) => props.$hue}, 20%, 98%, 0.95);
    text-shadow: 0 0 1.2vw hsla(${(props) => props.$hue}, 80%, 50%, 0.3),
      0 0.1vw 0.2vw hsla(0, 0%, 0%, 0.4);
  }
`;
