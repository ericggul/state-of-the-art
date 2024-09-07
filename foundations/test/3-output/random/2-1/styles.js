import { FlexCenterStyle, WholeContainer, BackgroundBlur } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  // background: black;

  font-family: Ubuntu;
  ${BackgroundBlur}

  flex-direction: column;
`;

export const Tokens = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Candidate = styled.div`
  font-size: 1vw;
  position: absolute;
  transform: translate(-50%, -50%);
  text-align: center;
`;

export const Pic = styled.svg`
  ${WholeContainer}
`;

export const Sentence = styled.div`
  font-size: 3vw;
  text-align: center;
  mix-blend-mode: difference;
`;
