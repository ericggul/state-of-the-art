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
  background: black;
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
`;

export const Pic = styled.svg`
  ${WholeContainer}

  filter: drop-shadow(0 0 0.5vw blue);

  path {
    // transition: 0.1s;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`;
