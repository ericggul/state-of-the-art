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

  animation: fadeIn 4s ease both;
  svg {
    width: 15vw;
    height: 15vw;
  }
`;

export const AnimatedText = styled.p`
  font-size: 1.75vw;
  font-weight: lighter;
  margin-top: 3vw;
  text-align: center;
  max-width: 70vw;
  color: white;
  opacity: ${({ $oscillatingOpacity, $isVisible }) =>
    $isVisible ? 1 - $oscillatingOpacity : 0};
  transition: opacity 1.5s ease;
  min-height: 1.5em;
`;
