import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";
import { shadowPulse } from "../styles/animations";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  background: #000;
  transition: all 0.5s;
  cursor: none !important;

  --hue: ${({ hue }) => hue};
  animation: ${shadowPulse} 4s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
  }

  svg {
    z-index: 0;
    position: absolute;
    top: 3vh;
    left: 0vw;
    width: 100vw;
    height: 100vh;
  }

  video {
    width: 100%;
    height: 100%;
  }
`;
