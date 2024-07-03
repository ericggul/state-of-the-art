import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
`;

export const Bg = styled.div`
  ${WholeContainer}
  background: white;
  transition: all 0.07s;
  z-index: 2;
`;
