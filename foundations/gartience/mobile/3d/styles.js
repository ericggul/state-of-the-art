import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  background: #111;
  z-index: 0;

  canvas {
    width: 100%;
    height: 100%;
  }
`;

export const RaisePhone = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background: rgba(0, 0, 0, .3);
  color: white;
  text-align: center;

  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 100;
  pointer-events: none !important;
  flex-direction: column;
`;
