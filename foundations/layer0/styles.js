import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background: black;
  flex-direction: column;
`;

export const Tokens = styled.div`
  display: flex;
`;

export const Token = styled.span`
  margin: 0 0.1vw;
  font-size: 1vw;
  ${({ startswithspace }) => startswithspace && "margin-left: 1vw;"}

  color: white;
  font-weight: bold;
  padding: 0.1vw 0.25vw;
  position: relative;
`;

export const PosVector = styled.div`
  position: absolute;
  top: 2vw;
  width: 100%;
  color: white;
  font-size: 0.5vw;
  font-weight: 300;

  left: 0;
  right: 0;
  margin: auto;
`;

export const NegVector = styled.div`
  position: absolute;
  bottom: 2vw;
  width: 100%;
  color: white;
  font-size: 0.5vw;
  font-weight: 300;

  left: 0;
  right: 0;
  margin: auto;
`;

export const Num = styled.div`
  opacity: ${({ num }) => Math.abs(num) * 10};
  text-align: center;
`;
