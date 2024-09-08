import { FlexCenterStyle, WholeContainer, BackgroundBlur } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  // background: black;

  ${BackgroundBlur}

  flex-direction: column;
`;

export const Tokens = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Candidate = styled.div`
  // ${({ isfocus }) => (isfocus ? "opacity: 1" : "opacity: 0.1")};
  // transition: all 0.3s;
  font-size: 1vw;
  position: absolute;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: bold;
`;

export const Pic = styled.svg`
  ${WholeContainer}

  path {
    // transition: all 0.3s;
  }
`;
