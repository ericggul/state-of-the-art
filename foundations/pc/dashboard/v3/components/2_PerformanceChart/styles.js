import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: calc(100% - 2.4vw);
  height: calc(100% - 2.4vw);

  padding: 1.2vw;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;
