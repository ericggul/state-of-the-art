import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

import {
  LINEWIDTH,
  LEFT,
  TOP,
  HEIGHT,
} from "@/foundations/pc/frame/full/styles";

const KEY_HUE = 230;

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

export const Card = styled.div`
  position: relative;
  height: 100%;
  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 5%, 0.85) 0%,
    hsla(${(props) => props.$hue}, 20%, 3%, 0.9) 100%
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* Updated border style to match lines */
  border: ${LINEWIDTH}vw solid hsla(${(props) => props.$hue}, 100%, 75%, 0.4);
  transition: all 0.3s ease-in-out;

  border-color: hsla(${(props) => props.$hue}, 80%, 75%, 0.45);
  // border-radius: 3px;
  box-shadow: 
      /* Increased ambient light */ 0 0.8vw 2.5vw
      hsla(${(props) => props.$hue}, 20%, 2%, 0.12),
    /* Enhanced glowing border */ 0 0 1.5vw
      hsla(${(props) => props.$hue}, 60%, 75%, 0.17),
    0 0 4vw hsla(${(props) => props.$hue}, 60%, 50%, 0.18),
    /* Enhanced bottom edge highlight */ 0 0.3vw 0.7vw
      hsla(${(props) => props.$hue}, 30%, 50%, 0.08),
    /* Enhanced inner glow */ inset 0 0 4vw
      hsla(${(props) => props.$hue}, 30%, 50%, 0.05),
    /* Enhanced top inner shadow */ inset 0 0.3vw 0.7vw
      hsla(${(props) => props.$hue}, 20%, 0%, 0.12);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      hsla(${(props) => props.$hue}, 40%, 100%, 0.03) 0%,
      transparent 50%
    );
    pointer-events: none;
  }
`;

export const CardTitle = styled.h3`
  position: absolute;
  font-size: 1.6vw;
  font-weight: 500;
  left: 0;
  top: -3vw;
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
