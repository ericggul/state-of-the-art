import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

export const Element = styled.div`
  width: 50vw;
  height: 50vh;
  ${FlexCenterStyle}

  iframe {
    width: 100%;
    height: 100%;

    //no styling for iframe
    border: none;
  }
`;
