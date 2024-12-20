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
  transition-delay: ${({ $isInitialFade }) => $isInitialFade ? "0.5s" : "0s"};

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
