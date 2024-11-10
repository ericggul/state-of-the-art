import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  video {
    width: 100%;
    height: 100%;
  }
`;
