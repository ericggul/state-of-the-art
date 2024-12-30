import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
`;

export const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 3s ease;
  transition-delay: ${({ $isInitialFade }) => ($isInitialFade ? "0.5s" : "0s")};

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const QRCodeWrapper = styled.div`
  ${FlexCenterStyle}
  position: absolute;
  width: 100vw;
  bottom: 3vw;

  flex-direction: column;
  z-index: 1;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  animation: fadeIn 8s ease both;
  animation-delay: 4s;
`;

export const SVGWrapper = styled.div`
  width: 12vw;
  height: 12vw;
  // position: absolute;

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.1);

  margin: 1vw;
  padding: 1vw;
  border-radius: 2vw;

  ${FlexCenterStyle}

  svg {
    width: 18vw;
    height: 18vw;
  }
`;

export const AnimatedText = styled.p`
  font-size: 1.5vw;
  font-weight: lighter;
  margin-top: 0vw;
  text-align: center;
  max-width: 70vw;
  color: white;
  opacity: ${({ $oscillatingOpacity, $isVisible }) =>
    $isVisible ? 1 - $oscillatingOpacity : 0};
  transition: opacity 1.5s ease;
  min-height: 1.5em;
`;
