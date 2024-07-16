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

export const Row = styled.div`
  ${FlexCenterStyle}
  flex-direction: row;
  margin: 0.2vw 0;
`;

export const TopRow = styled.div`
  ${FlexCenterStyle}
  flex-direction: row;
  margin: 0.2vw 0;
  margin-bottom: 1vw;
`;

export const Token = styled.div`
  width: 10vw;
  text-align: center;
`;

export const Value = styled.div`
  width: 5vw;
  text-align: center;
`;
