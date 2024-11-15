import styled from "styled-components";

import { FlexCenterStyle, WholeContainer } from "@/styles";

export const IframeContainer = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
`;

export const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export const YoutubeOverlay = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  pointer-events: none;
`;

export const YoutubeIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
