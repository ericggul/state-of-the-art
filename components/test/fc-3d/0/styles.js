import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  background: #111;

  canvas {
    width: 100%;
    height: 100%;
  }
`;

export const OrientationPermissionModal = styled.div`
  ${WholeContainer}
  background: rgba(0, 0, 0, 0.8);
  color: white;
  z-index: 10;
  ${FlexCenterStyle}
`;
