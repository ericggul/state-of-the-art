import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

import {
  LINEWIDTH,
  LEFT,
  TOP,
  HEIGHT,
} from "@/foundations/pc/frame/full/styles";

export const Container = styled.div`
  ${WholeContainer}
  background: #000;
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

  border: ${LINEWIDTH * 1.5}vw solid white;
`;

export const CardTitle = styled.h3`
  position: absolute;
  font-size: 1.8vw;
  left: 0;
  top: -3vw;
  margin: 0;
  padding: 0;
  color: #fff;
  z-index: 2;
`;
