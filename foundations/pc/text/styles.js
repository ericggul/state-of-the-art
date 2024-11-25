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

const depthColors = {
  0: "#00ffff",
  1: "#00ccff",
  2: "#0099ff",
  3: "#0066ff",
  4: "#0033ff",
};

export const StructureText = styled.pre.withConfig({
  shouldComponentUpdate: true,
  shouldComponentUpdateForProp: (prop) => prop !== "needsScroll",
})`
  color: #00ffff;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  position: absolute;
  left: 1vw;

  width: 100%;
  height: 100%;
  overflow: ${(props) => (props.needsScroll ? "hidden" : "visible")};
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
    color: #666;
    user-select: none;
    transform: translateZ(0);

    .branch-char {
      color: #888;
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

  ${Object.entries(depthColors).map(
    ([depth, color]) => css`
      .depth-${depth} {
        color: ${color};
        transform: translateZ(0);
      }
    `
  )}

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
        props.needsScroll
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
