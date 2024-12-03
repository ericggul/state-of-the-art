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
  background: hsl(${(props) => props.$hue}, 5%, 2%);
  padding: 4vw;
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
  // ${FlexCenterStyle}
  align-items: center;
  width: 100%;
  height: 30vh;
  margin-top: 10vh;
`;

export const Card = styled.div`
  position: relative;
  height: 100%;
  background: hsla(${(props) => props.$hue}, 100%, 3%, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: ${LINEWIDTH * 1.5}vw solid
    hsla(${(props) => props.$hue}, 30%, 85%, 0.5);
  box-shadow: 0 0 2vw hsla(${(props) => props.$hue}, 80%, 50%, 0.1),
    0 0 4vw hsla(${(props) => props.$hue}, 50%, 50%, 0.05),
    inset 0 0 2vw hsla(${(props) => props.$hue}, 30%, 50%, 0.05);
`;

export const CardTitle = styled.h3`
  position: absolute;
  font-size: 1.8vw;
  left: 0;
  top: -3vw;
  margin: 0;
  padding: 0;
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.95);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.3);
  z-index: 2;
`;
