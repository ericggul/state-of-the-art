import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled, { keyframes, css } from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${WholeContainer}
  ${FlexCenterStyle}

  font-size: 1vw;
  color: #fff;
  cursor: none;

  background: ${({ $isblack }) => ($isblack ? "black" : "white")};
`;
