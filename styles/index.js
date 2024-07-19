import { css } from "styled-components";

export const FlexCenterStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WholeContainer = css`
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: ${({ theme }) => theme.windowWidth}px;
  height: ${({ theme }) => theme.windowHeight}px;
`;

export const BackgroundBlur = css`
  ${WholeContainer}
  background: rgba(0, 0, 0, .2);
  backdrop-filter: blur(0.5vw);
  -webkit-backdrop-filter: blur(0.5vw);
`;
