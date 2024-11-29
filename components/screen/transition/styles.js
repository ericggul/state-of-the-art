import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  z-index: 9999;
  background: rgb(0, 0, 255);
`;
