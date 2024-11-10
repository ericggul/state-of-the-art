import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}

  video {
    width: 100%;
    height: 100%;
  }
`;

export const QRCodeWrapper = styled.div`
  ${FlexCenterStyle}
  ${WholeContainer}
  flex-direction: column;

  p {
    font-size: 1.5vw;
    font-weight: lighter;
    margin-top: 3vw;
    font-family: Helvetica;
  }

  z-index: 100;

  svg {
    width: 15vw;
    height: 15vw;
  }
`;
