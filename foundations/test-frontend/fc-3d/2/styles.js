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
