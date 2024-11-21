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

export const SpeechText = styled.div`
  ${FlexCenterStyle};
  width: 90vw;
  text-align: center;
  color: white;
  font-size: 3vw;

  line-height: 1.3;
  word-break: keep-all;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
