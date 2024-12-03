import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: calc(100% - 2vw);
  height: calc(100% - 2vw);
  padding: 1vw;

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

  canvas {
    width: 100% !important;
    height: 100% !important;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
`;
