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
  flex-wrap: wrap;
`;

export const Token = styled.span`
  font-size: 1vw;
  font-weight: 500;
  color: white;
  width: 5vw;

  ${FlexCenterStyle}
  text-align: center;
  flex-direction: column;
`;

export const Candidate = styled.div`
  ${({ isfocus }) => (isfocus ? "opacity: 1" : "opacity: 0.1")};
`;
