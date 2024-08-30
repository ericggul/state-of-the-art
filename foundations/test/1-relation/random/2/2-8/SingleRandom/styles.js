import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${WholeContainer}
  ${FlexCenterStyle}

  font-size: 1vw;
  color: #fff;
  background: transparent !important;
`;

export const MidRow = styled.div`
  ${FlexCenterStyle}
`;

export const Token = styled.div`
  font-size: 1vw;
  font-weight: 500;
  color: white;

  ${FlexCenterStyle}
  text-align: center;
  flex-direction: column;

  position: absolute;

  transform: translate(-50%, -50%);
  transition: all 0.1s;
`;

export const Pic = styled.svg`
  ${WholeContainer}

  path {
    // transition: 0.1s linear;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;
