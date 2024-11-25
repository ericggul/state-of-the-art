import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  position: relative;
`;

export const Background = styled.div`
  position: absolute;
  inset: 0;
  opacity: ${({ $isVisible, $oscillatingOpacity }) => {
    const baseOpacity = $isVisible ? 1 : 0;
    return baseOpacity * $oscillatingOpacity;
  }};
  transition: opacity
    ${({ $isVisible }) =>
      // If $isVisible is changing, use 3s, otherwise use 1.5s for oscillation
      typeof $isVisible === "boolean" ? "3s" : "1.5s"}
    ease;
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const QRCodeWrapper = styled.div`
  ${FlexCenterStyle}
  position: relative;
  flex-direction: column;
  z-index: 1;

  p {
    font-size: 1.5vw;
    font-weight: lighter;
    margin-top: 3vw;
    color: white;
  }

  svg {
    width: 15vw;
    height: 15vw;
  }
`;
