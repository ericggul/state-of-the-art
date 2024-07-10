import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
`;

export const Bg = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background: white;
  transition: opacity 0.1s;
  z-index: 2;
`;
