import styled, { keyframes, css } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";
import { animated } from "react-spring";

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

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
  cursor: none;
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
  color: hsla(${(props) => props.$hue}, 20%, 95%, 0.8);
  font-size: 0.933vw;
  line-height: 1.2;
  text-align: left;
  position: absolute;
  left: 0.5vw;
  padding: 1.067vw;
  max-width: 25vw;
  white-space: pre-wrap;

  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.1) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.1) 100%
  );
  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);

  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
      transparent
    );
    animation: ${scanline} 2s linear infinite;
    opacity: 0.5;
  }

  box-shadow: 0 0 1.5vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1),
    inset 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.05);
`;

export const LeftBlur = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 40vw;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0));
`;
