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
    return typeof $oscillatingOpacity === "number"
      ? baseOpacity * $oscillatingOpacity
      : baseOpacity;
  }};
  transition: opacity
    ${({ $isVisible }) => (typeof $isVisible === "boolean" ? "3s" : "1.5s")}
    ease;
  ${({ $isVisible }) =>
    typeof $isVisible === "boolean" && "transition-delay: 0.5s;"}
  display: block !important;
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block !important;
`;

export const QRCodeWrapper = styled.div`
  ${FlexCenterStyle}
  position: relative;
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

  animation: fadeIn 6s ease both;
  animation-delay: 2s;
`;

export const SVGWrapper = styled.div`
  width: 18vw;
  height: 18vw;

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.1);

  margin: 2vw;
  padding: 2vw;
  border-radius: 2vw;

  ${FlexCenterStyle}

  svg {
    width: 18vw;
    height: 18vw;
  }
`;

export const AnimatedText = styled.p`
  font-size: 1.75vw;
  font-weight: lighter;
  margin-top: 2.5vw;
  text-align: center;
  max-width: 70vw;
  color: white;
  opacity: ${({ $oscillatingOpacity, $isVisible }) =>
    $isVisible ? 1 - $oscillatingOpacity : 0};
  transition: opacity 1.5s ease;
  min-height: 1.5em;
`;
