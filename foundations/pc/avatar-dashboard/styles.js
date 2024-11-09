import styled from "styled-components";
import { WholeContainer, FlexCenterStyle } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  canvas {
    width: 100%;
    height: 100%;
  }
`;
