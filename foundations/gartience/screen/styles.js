import styled, { css } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${FlexCenterStyle};
  ${WholeContainer};
  flex-direction: column;
  position: relative;
`;

export const QRContainer = styled.div`
  ${FlexCenterStyle};
  position: absolute;
  top: 2vh;
  right: 2vw;
  width: auto;
  height: auto;
`;

export const Cursor = styled.span`
  display: inline-block;
  width: 0.1em;
  height: 1em;
  background-color: white;
  margin-left: 2px;
  animation: blink 1s step-end infinite;

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

export const SpeechText = styled.div`
  ${FlexCenterStyle};
  width: 70vw;
  text-align: center;
  color: white;
  font-size: 4vw;
  font-weight: 700;
  line-height: 1.3;
  word-break: keep-all;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: pre-wrap;
`;
