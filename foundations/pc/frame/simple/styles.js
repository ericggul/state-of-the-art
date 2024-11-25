import styled, { css } from "styled-components";
import { WholeContainer } from "@/styles";

export const LINEWIDTH = 0.1;
export const MARGIN = 5;

export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
  z-index: 9999;
  pointer-events: none;
`;

export const VerticalLine = styled.div`
  position: absolute;
  width: 0.03vw;
  top: 0;
  height: 100vh;
  background: #fff;
  top: ${(props) => props.$top}vh;
  left: ${(props) => props.$left}vw;
  height: ${(props) => props.$height || 100}vh;
`;

export const VerticalName = styled.div`
  position: absolute;
  transform: rotate(-90deg);
  transform-origin: left top;
  background: transparent;
  color: #fff;
  white-space: nowrap;
  font-size: 1.3vw;
  padding: 0.5vw;
  text-align: center;
  font-weight: bold;
  top: ${(props) => props.$top + 15}vh;
  left: ${(props) => props.$left - 0.3}vw;
  width: 2vw;
  display: flex;
  justify-content: center;
`;

export const HorizontalLine = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: ${(props) =>
    props.$width?.titleWidth - props.$width?.verWidth + MARGIN || "27"}vw;
  bottom: ${(props) => props.$bottom}vw;
  right: 0;
  background: #fff;
`;

export const HorizontalLine2 = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: ${(props) => props.$width?.verWidth || "2"}vw;
  bottom: ${(props) => props.$bottom}vw;
  right: ${(props) =>
    props.$width
      ? props.$width.titleWidth - props.$width.verWidth + 1 + MARGIN
      : 28}vw;
  background: #fff;
`;

export const ModelTitle = styled.div`
  position: absolute;
  bottom: ${(props) => props.$bottom - 0.1}vw;
  right: ${(props) =>
    props.$width ? props.$width.titleWidth + 1 + MARGIN : 30}vw;
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

export const HorizontalCube = styled.div`
  position: absolute;
  right: 8vw;
  width: 4vw;
  height: 1vw;
  bottom: ${(props) => props.$bottom}vw;
  transform: translateY(100%);
  background: #fff;
`;

export const VerticalCube = styled.div`
  position: absolute;
  right: 2.5vw;
  width: 0.8vw;
  height: ${(props) => props.$bottom - 0.2}vw;
  bottom: 0.2vw;
  background: #fff;
`;
