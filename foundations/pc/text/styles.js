import styled, { css } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";
import { animated } from "react-spring";

// Add this at the top with other utility functions
const cycleHue = (hue) => {
  const h = ((hue % 360) + 360) % 360; // Normalize hue to 0-360
  if (h < 60) return h + 180;
  if (h > 240) return h - 180;
  return h;
};

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background-color: #000000;
  padding: 2.133vw;
  transform: translateZ(0);
`;

export const Canvas = styled(animated.div)`
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
      hsla(${props.$hue}, 79%, 50%, 0.8) 50%,
      transparent 100%
    )`};
    mix-blend-mode: overlay;
    pointer-events: none;
    transition: background 0.3s ease;
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
  const saturation = 20 - depth * 3; // Decrease saturation with depth
  const lightness = 90 - depth * 8; // More subtle lightness decrease
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

export const StructureText = styled(animated.pre)`
  color: #00ffff;
  font-size: 0.933vw;
  line-height: 1.5;
  text-align: left;
  position: absolute;
  left: 0.5vw;

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
    color: hsla(${(props) => props.$hue}, 15%, 65%, 0.7);
    user-select: none;
    transform: translateZ(0);
    letter-spacing: 0.05em;
    transition: color 0.3s ease;
    text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 70%, 50%, 0.2);

    .branch-char {
      color: hsla(${(props) => props.$hue}, 85%, 75%, 0.9);
      font-weight: 500;
      text-shadow: 0 0 1.333vw hsla(${(props) => props.$hue}, 80%, 50%, 0.3);
    }
  }

  .tree-content {
    display: inline-flex;
    align-items: center;
    min-height: 1.5em;
    transform: translateZ(0);
    letter-spacing: 0.02em;
  }

  .dims {
    color: hsla(${(props) => cycleHue(props.$hue + 60)}, 70%, 75%, 0.85);
    margin-left: 0.533vw;
    font-weight: 400;
    text-shadow: 0 0 0.667vw
      hsla(${(props) => cycleHue(props.$hue + 60)}, 70%, 50%, 0.25);
  }

  .type {
    color: hsla(${(props) => cycleHue(props.$hue - 30)}, 60%, 75%, 0.8);
    margin-left: 0.533vw;
    font-weight: 400;
    text-shadow: 0 0 0.667vw
      hsla(${(props) => cycleHue(props.$hue - 30)}, 60%, 50%, 0.2);
  }

  .params {
    color: hsla(${(props) => cycleHue(props.$hue - 60)}, 70%, 75%, 0.8);
    margin-left: 0.533vw;
    font-size: 0.8vw;
    font-weight: 400;
    text-shadow: 0 0 0.667vw
      hsla(${(props) => cycleHue(props.$hue - 60)}, 70%, 50%, 0.2);
  }

  .grid {
    color: hsla(${(props) => cycleHue(props.$hue + 30)}, 70%, 75%, 0.8);
    margin-left: 0.533vw;
    font-size: 0.8vw;
    font-weight: 400;
    text-shadow: 0 0 0.667vw
      hsla(${(props) => cycleHue(props.$hue + 30)}, 70%, 50%, 0.2);
  }

  ${({ $hue }) => {
    const depthColors = generateDepthColors($hue);
    return Object.entries(depthColors).map(
      ([depth, color]) => css`
        .depth-${depth} {
          color: hsla(
            ${cycleHue($hue)},
            ${20 - depth * 2}%,
            ${85 - depth * 5}%,
            ${0.9 - depth * 0.1}
          );
          transform: translateZ(0);
          text-shadow: 0 0 1.333vw
            hsla(
              ${cycleHue($hue)},
              ${30 - depth * 2}%,
              50%,
              ${0.2 - depth * 0.03}
            );
          transition: color 0.3s ease, text-shadow 0.3s ease;
        }

        .depth-${depth} .name {
          color: hsla(
            ${cycleHue($hue)},
            ${70 - depth * 5}%,
            ${85 - depth * 5}%,
            ${0.95 - depth * 0.1}
          );
          text-shadow: 0 0 1vw
            hsla(${cycleHue($hue)}, 70%, 50%, ${0.3 - depth * 0.04});
        }
      `
    );
  }}

  .model-structure {
    display: flex;
    flex-direction: column;
    padding: 1.067vw;
    gap: 0.213vw;
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

    filter: drop-shadow(
      0 0 1.333vw hsla(${(props) => props.$hue}, 20%, 50%, 0.05)
    );
  }

  .disclaimer {
    color: hsla(${(props) => props.$hue}, 15%, 75%, 0.4);
    text-shadow: 0 0 0.667vw hsla(${(props) => props.$hue}, 70%, 50%, 0.1);
    transition: color 0.3s ease;
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
