import styled, { css } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${FlexCenterStyle};
  ${WholeContainer};
  flex-direction: column;
  position: relative;
`;

export const ContentContainer = styled.div`
  ${FlexCenterStyle};
  width: 65vw;
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
  background: rgba(0, 0, 0, 0.3);
  padding: 2vw;
  border-radius: 1vw;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
`;

export const Cursor = styled.span`
  display: inline-block;
  width: 0.08em;
  height: 1em;
  background-color: #fff;
  margin-left: 2px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
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
  gap: 1vw;
  width: 100%;
  position: absolute;
  top: 50%;
  transition: all 0.3s ease;

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
  font-size: 2.5vw;
  font-weight: 600;
  line-height: 1.4;
  word-break: keep-all;
  white-space: pre-wrap;
  transition: all 0.3s ease;

  ${(props) =>
    props.$hasQR
      ? css`
          text-align: left;
        `
      : css`
          text-align: center;
        `}
`;

export const SpeechTextEn = styled(SpeechText)`
  font-size: 1.6vw;
  font-weight: 600;
  opacity: 0.9;
  font-family: "Courier New", monospace;
  color: #a0f0ff;
`;
