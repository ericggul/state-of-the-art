import styled, { css } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background-color: #000000;
  padding: 2rem;
  transform: translateZ(0);
`;

export const Canvas = styled.div`
  ${WholeContainer}
  width: 120vw;
  left: 0vw;
  opacity: 0.5;
  transform: translateZ(0);

  background-color: #000000;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => `linear-gradient(
      45deg,
      transparent 0%,
      hsla(${props.$hue}, 100%, 50%, 1) 50%,
      transparent 100%
    )`};
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  canvas {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    transform: translateZ(0);
  }
`;

const scrollbarHide = css`
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Create a function to generate depth colors based on KEY_HUE
const getDepthColor = (depth, hue) => {
  const saturation = 100;
  const lightness = 65 - depth * 10; // Decrease lightness with depth
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Create dynamic depth colors based on KEY_HUE
const generateDepthColors = (hue) => ({
  0: getDepthColor(0, hue),
  1: getDepthColor(1, hue),
  2: getDepthColor(2, hue),
  3: getDepthColor(3, hue),
  4: getDepthColor(4, hue),
});

export const StructureText = styled.pre.withConfig({
  shouldComponentUpdate: true,
  shouldComponentUpdateForProp: (prop) => prop !== "$needsScroll",
})`
  color: #00ffff;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  position: absolute;
  left: 1vw;

  pointer-events: none;

  width: 100%;
  height: 100%;
  overflow: ${(props) => (props.$needsScroll ? "hidden" : "visible")};
  white-space: pre;
  ${scrollbarHide}
  z-index: 100;

  // Optimize text rendering
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;

  // GPU acceleration
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform;

  // Prevent subpixel rendering issues
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transform: translateZ(0);
  }

  .tree-line {
    color: ${(props) => `hsla(${props.$hue}, 25%, 40%, 1)`};
    user-select: none;
    transform: translateZ(0);

    .branch-char {
      color: ${(props) => `hsla(${props.$hue}, 30%, 50%, 1)`};
      font-weight: bold;
    }
  }

  .tree-content {
    display: inline-flex;
    align-items: center;
    min-height: 1.5em;
    transform: translateZ(0);
  }

  .dims {
    color: #00ff00;
    margin-left: 8px;
  }

  .type {
    color: #888;
    margin-left: 8px;
  }

  .params {
    color: #ff00ff;
    margin-left: 8px;
    font-size: 12px;
  }

  .grid {
    color: #ffff00;
    margin-left: 8px;
    font-size: 12px;
  }

  ${({ $hue }) => {
    const depthColors = generateDepthColors($hue);
    return Object.entries(depthColors).map(
      ([depth, color]) => css`
        .depth-${depth} {
          color: ${color};
          transform: translateZ(0);
        }
      `
    );
  }}

  .model-structure {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.2rem;
    position: absolute;
    width: 100%;

    // Center both vertically and horizontally when not scrolling
    top: 50%;
    left: 50%;
    transform: ${
      (props) =>
        props.$needsScroll
          ? "translateX(-50%)" // Only center horizontally when scrolling
          : "translate(-50%, -50%)" // Center both ways when not scrolling
    };

    // Optimize for animation
    will-change: transform;
    backface-visibility: hidden;

    &.scrolling {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      padding-top: 15vh;
      padding-bottom: 100vh;
    }
  }
`;

export const LeftBlur = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 40vw;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0));
`;
