import styled, { css, keyframes } from "styled-components";
import { WholeContainer } from "@/styles";

export const LINEWIDTH = 0.15;
export const MARGIN = 8;

// Common Styles
const commonPositionStyles = css`
  position: absolute;
  background: transparent;
`;

const commonColorStyles = css`
  background: hsla(${(props) => props.$hue}, 100%, 95%, 0.35);
`;

const commonGlowStyles = css`
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 95%, 0.4),
    0 0 3vw hsla(${(props) => props.$hue}, 100%, 50%, 0.2);
`;

const commonTextStyles = css`
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.95);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.3);
`;

const commonLineStyles = css`
  ${commonPositionStyles}
  ${commonColorStyles}
  ${commonGlowStyles}
`;

// Animations
const verticalLineAppear = keyframes`
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
`;

const horizontalLineAppear = keyframes`
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
`;

// Container
export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
  z-index: 999;
  pointer-events: none;
  transform-origin: bottom right;
`;

// Lines
export const VerticalLine = styled.div`
  ${commonLineStyles}
  width: ${LINEWIDTH}vw;
  top: ${(props) => props.$top}vh;
  left: ${(props) => props.$left}vw;
  height: ${(props) => props.$height || 100}vh;
  transform-origin: center bottom;
  opacity: ${(props) => (props.$isAnimating ? 0 : 1)};
  animation: ${(props) => (props.$isAnimating ? verticalLineAppear : "none")}
    0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: ${(props) => props.$index * 100}ms;
  will-change: transform, opacity;
`;

const BaseHorizontalLine = css`
  ${commonLineStyles}
  height: ${LINEWIDTH}vw;
  transform-origin: right center;
  opacity: ${(props) => (props.$isAnimating ? 0 : 1)};
  animation: ${(props) => (props.$isAnimating ? horizontalLineAppear : "none")}
    0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: ${(props) => props.$index * 100}ms;
  will-change: transform, opacity;
`;

export const HorizontalLine = styled.div`
  ${BaseHorizontalLine}
  width: ${(props) =>
    props.$width?.titleWidth - props.$width?.verWidth + MARGIN || "27"}vw;
  right: 0;
  bottom: ${(props) => props.$bottom}vw;
`;

export const HorizontalLine2 = styled.div`
  ${BaseHorizontalLine}
  width: ${(props) => props.$width?.verWidth || "2"}vw;
  right: ${(props) =>
    props.$width
      ? props.$width.titleWidth - props.$width.verWidth + 1 + MARGIN
      : 28}vw;
  bottom: ${(props) => props.$bottom}vw;
`;

export const HorizontalLineGeneralA = styled.div`
  ${BaseHorizontalLine}
  width: ${(props) => props.$width}vw;
  left: ${(props) => props.$left}vw;
  top: ${(props) => props.$top}vh;
  transform-origin: left center;
`;

export const HorizontalLineGeneralB = styled.div`
  ${BaseHorizontalLine}
  width: ${(props) => props.$width}vw;
  right: ${(props) => props.$right}vw;
  bottom: ${(props) => props.$bottom}vh;
`;

// Text Elements
export const VerticalName = styled.div`
  position: absolute;
  transform: rotate(90deg);
  transform-origin: left top;
  background: transparent;
  ${commonTextStyles}
  white-space: nowrap;
  font-size: 1.1vw;
  text-align: center;
  font-weight: bold;
  top: ${(props) => props.$top}vh;
  left: ${(props) => props.$left}vw;
  display: flex;
  justify-content: center;
`;

export const HorizontalName = styled.div`
  position: absolute;
  background: transparent;
  ${commonTextStyles}
  white-space: nowrap;
  font-size: 1.1vw;
  text-align: center;
  font-weight: bold;
  top: ${(props) => props.$top}vh;
  left: ${(props) => props.$left}vw;
  display: flex;
  justify-content: center;
`;

export const ModelTitle = styled.div`
  position: absolute;
  bottom: ${(props) => props.$bottom - 0.1}vw;
  right: ${(props) =>
    props.$width ? props.$width.titleWidth + 1 + MARGIN : 30}vw;
  transform: translateY(100%) translateX(100%);
  ${commonTextStyles}
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 2vw;
`;

// Typography
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

export const ModelType = styled.h2`
  font-size: 0.5vw;
  position: absolute;
  min-width: 12vw;
  top: 0;
  left: ${(props) => props.$width?.verWidth + 1}vw;
  transform: translateY(-100%);
  padding-bottom: 0.35vw;
`;

// Cubes
const commonCubeStyles = css`
  ${commonPositionStyles}
  background: hsla(${(props) => props.$hue}, 100%, 75%, 0.5);
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4);
`;

export const HorizontalCube = styled.div`
  ${commonCubeStyles}
  right: 8vw;
  width: 4vw;
  height: 1vw;
  bottom: ${(props) => props.$bottom}vw;
  transform: translateY(100%);
`;

export const VerticalCube = styled.div`
  ${commonCubeStyles}
  right: 2.5vw;
  width: 0.8vw;
  height: ${(props) => props.$bottom - 0.2}vw;
  bottom: 0.2vw;
`;
