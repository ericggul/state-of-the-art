import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  background: #000;
  transition: all 0.5s;
  cursor: none;

  img {
    width: 100%;
    height: 100%;
  }

  svg {
    z-index: 0;
    cursor: pointer;
    position: absolute;
    top: 3vh;
    left: 10vw;
    width: 90vw;
    height: 100vh;
  }

  video {
    width: 100%;
    height: 100%;
  }
`;
