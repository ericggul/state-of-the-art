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
  pointer-events: none;
`;

export const DiagonalLine = styled.div`
  position: absolute;
  width: 10vw;
  height: ${LINEWIDTH}vw;
  top: 60vh;
  left: 23vw;
  background: #fff;
  transform: translate(-50%, -50%) rotate(-50deg);
`;

export const HorizontalLine = styled.div`
  position: absolute;
  width: 50vw;
  height: ${LINEWIDTH}vw;
  bottom: 24vh;
  left: 20vw;
  background: #fff;
`;

export const HorizontalLine2 = styled.div`
  position: absolute;
  width: 80vw;
  height: ${LINEWIDTH}vw;
  top: 38vh;
  left: ${LEFT}vw;
  background: #fff;
`;
