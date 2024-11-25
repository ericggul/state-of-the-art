import styled from "styled-components";
import { WholeContainer } from "@/styles";

export const LINEWIDTH = 0.1;
export const LEFT = 3;
export const TOP = 4;
export const HEIGHT = 92;

export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
  z-index: 9999;
  pointer-events: none;
`;

export const HorizontalLine = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: 27vw;
  bottom: 3vw;
  right: 0;
  background: #fff;
`;

export const HorizontalLine2 = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: 2vw;
  bottom: 3vw;
  right: 28vw;
  background: #fff;
`;

export const ModelTitle = styled.div`
  position: absolute;

  bottom: 2.9vw;
  right: 30vw;
  transform: translateY(100%) translateX(100%);
`;

export const Title = styled.h1`
  font-size: 1.3vw;
`;

export const Ver = styled.h2`
  font-size: 0.7vw;
  position: absolute;
  top: 0;
  transform: translateY(-100%);
  padding-bottom: 0.2vw;
`;
