import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Wrapper = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  z-index: 1000;
  background: black;
  pointer-events: none !important;
  transition: background 2s ease-in-out;
`;

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  color: white;
  background: black;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  font-size: 1.5vw;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  animation: fadeIn 2s both;
`;
