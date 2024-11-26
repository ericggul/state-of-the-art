import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  color: white;
  background: black;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9999;
  font-size: 1.5vw;
`;
