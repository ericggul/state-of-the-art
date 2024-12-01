import styled, { css } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${FlexCenterStyle};
  ${WholeContainer};
  flex-direction: column;
  position: relative;

  font-family: "SF Pro KR", "SF Pro Display", "SF Pro", "Apple SD Gothic Neo",
    "Pretendard Variable", -apple-system, BlinkMacSystemFont, system-ui,
    "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "kern" 1;
  font-kerning: normal;

  //korean: force
`;

export const ContentContainer = styled.div`
  ${FlexCenterStyle};
  width: 80vw;
  height: 100%;
  position: relative;
  margin: 0 auto;
`;

export const QRContainer = styled.div`
  ${FlexCenterStyle};
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: auto;
  height: auto;
  z-index: 10;
  background: rgba(0, 0, 0, 0.4);
  padding: 2.5vw;
  border-radius: 1.5vw;

  backdrop-filter: blur(8px);
`;

export const Cursor = styled.span`
  display: inline-block;
  width: 0.08em;
  height: 1em;
  background-color: #fff;
  margin-left: 2px;
  box-shadow: 0 0 12px rgba(160, 240, 255, 0.8);
  animation: blink 0.8s step-end infinite;

  @keyframes blink {
    from,
    to {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

export const SpeechContainer = styled.div`
  ${FlexCenterStyle};
  flex-direction: column;
  gap: 1.2vw;
  width: 100%;
  position: absolute;
  top: 50%;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  ${(props) =>
    props.$hasQR
      ? css`
          left: 0;
          transform: translate(0, -50%);
          width: 60%;
          align-items: flex-start;
        `
      : css`
          left: 50%;
          transform: translate(-50%, -50%);
          align-items: center;
        `}
`;

export const SpeechText = styled.div`
  width: 100%;
  color: white;
  font-size: 2.3vw;
  font-weight: 700;
  line-height: 1.3;
  word-break: keep-all;
  white-space: pre-wrap;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
    0 0 40px rgba(255, 255, 255, 0.1);
  font-family: inherit;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "kern" 1;
  font-kerning: normal;

  ${(props) =>
    props.$hasQR
      ? css`
          text-align: left;
          transform: translateX(0);
        `
      : css`
          text-align: center;
          transform: translateX(0);
        `}
`;

export const SpeechTextEn = styled(SpeechText)`
  font-size: 1.7vw;
  font-weight: 500;
  opacity: 0.95;
  font-family: "SF Mono", "Fira Code", "Courier New", monospace;
  color: rgba(160, 240, 255, 0.9);
  letter-spacing: 0;
  text-shadow: 0 0 15px rgba(160, 240, 255, 0.3),
    0 0 30px rgba(160, 240, 255, 0.1);
`;
