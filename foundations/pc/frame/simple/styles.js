import styled, { css, keyframes } from "styled-components";
import { WholeContainer } from "@/styles";

export const LINEWIDTH = 0.15;
export const MARGIN = 13;

const commonPositionStyles = css`
  position: absolute;
  background: transparent;
`;

export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
  z-index: 999;
  pointer-events: none;
  transform: scale(1.2);
  transform-origin: bottom right;
`;

const lineAppear = keyframes`
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
`;

export const VerticalLine = styled.div`
  ${commonPositionStyles}
  width: 0.03vw;
  top: ${(props) => props.$top}vh;
  left: ${(props) => props.$left}vw;
  height: ${(props) => props.$height || 100}vh;
  transform-origin: center bottom;
  background: linear-gradient(
    180deg,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2)
  );
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4),
    0 0 3vw hsla(${(props) => props.$hue}, 100%, 50%, 0.2);
  opacity: ${(props) => (props.$isAnimating ? 0 : 1)};
  animation: ${(props) => (props.$isAnimating ? lineAppear : "none")} 0.6s
    cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: ${(props) => props.$index * 100}ms;
  will-change: transform, opacity;
`;

export const VerticalName = styled.div`
  position: absolute;
  transform: rotate(-90deg);
  transform-origin: left top;
  background: transparent;
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.95);
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
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.3);
`;

export const HorizontalLine = styled.div`
  ${commonPositionStyles}
  height: ${LINEWIDTH}vw;
  width: ${(props) =>
    props.$width?.titleWidth - props.$width?.verWidth + MARGIN || "27"}vw;
  bottom: ${(props) => props.$bottom}vw;
  right: 0;
  background: linear-gradient(
    90deg,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2)
  );
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4),
    0 0 3vw hsla(${(props) => props.$hue}, 100%, 50%, 0.2);
`;

export const HorizontalLine2 = styled.div`
  ${commonPositionStyles}
  height: ${LINEWIDTH}vw;
  width: ${(props) => props.$width?.verWidth || "2"}vw;
  bottom: ${(props) => props.$bottom}vw;
  right: ${(props) =>
    props.$width
      ? props.$width.titleWidth - props.$width.verWidth + 1 + MARGIN
      : 28}vw;
  background: linear-gradient(
    90deg,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2)
  );
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4),
    0 0 3vw hsla(${(props) => props.$hue}, 100%, 50%, 0.2);
`;

export const ModelTitle = styled.div`
  position: absolute;
  bottom: ${(props) => props.$bottom - 0.1}vw;
  right: ${(props) =>
    props.$width ? props.$width.titleWidth + 1 + MARGIN : 30}vw;
  transform: translateY(100%) translateX(100%);
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.95);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 2vw;
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

export const ModelType = styled.h2`
  font-size: 0.5vw;
  position: absolute;
  min-width: 12vw;

  top: 0;
  left: ${(props) => props.$width?.verWidth + 1}vw;
  transform: translateY(-100%);
  padding-bottom: 0.35vw;
`;

export const HorizontalCube = styled.div`
  ${commonPositionStyles}
  right: 8vw;
  width: 4vw;
  height: 1vw;
  bottom: ${(props) => props.$bottom}vw;
  transform: translateY(100%);
  background: hsla(${(props) => props.$hue}, 100%, 75%, 0.5);
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4);
`;

export const VerticalCube = styled.div`
  ${commonPositionStyles}
  right: 2.5vw;
  width: 0.8vw;
  height: ${(props) => props.$bottom - 0.2}vw;
  bottom: 0.2vw;
  background: hsla(${(props) => props.$hue}, 100%, 75%, 0.5);
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4);
`;
