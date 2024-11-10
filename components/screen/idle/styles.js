import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes, css } from "styled-components";

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  z-index: 100;
  ${(props) =>
    props.$isFrontend &&
    css`
      animation: ${fadeOut} 3s forwards;
    `}
`;
