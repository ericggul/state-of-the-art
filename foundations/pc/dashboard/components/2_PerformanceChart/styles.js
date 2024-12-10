import styled, { keyframes } from "styled-components";

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const pulseGlow = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { opacity: 0.3; }
`;

export const Container = styled.div`
  position: relative;
  width: calc(100% - 2vw);
  height: calc(100% - 2vw);
  padding: 1vw;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.05);

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
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: ${scanline} 1s linear infinite;
    z-index: 2;
  }

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    animation: ${pulseGlow} 1s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
  }
`;
