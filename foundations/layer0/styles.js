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
  ${({ startsWithSpace }) => startsWithSpace && "margin-left: 1vw;"}

  color: black;
  font-weight: bold;
  padding: 0.1vw 0.25vw;
  position: relative;
`;

export const Vector = styled.div`
  position: absolute;
  width: 100%;
  color: white;
  font-size: 0.5vw;
  font-weight: 300;
`;
