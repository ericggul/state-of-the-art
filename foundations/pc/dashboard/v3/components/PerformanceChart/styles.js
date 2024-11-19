import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.5vw;
  background: rgba(255, 255, 255, 0.02);
  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 30vh;
  position: relative;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;
