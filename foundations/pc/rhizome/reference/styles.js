import { FlexCenterStyle, WholeContainer } from "styles/common";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;

  font-family: Courier New;
  transition: all 0.5s;

  svg {
    z-index: 0;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  ${({ show }) => (show ? "opacity: 1" : "opacity: 0")};
  transition: all 0.5s;
`;

export const CenterText = styled.div`
  font-size: 10vw;
  font-family: "Bebas Neue";
  color: rgba(255, 255, 255, 1);
  pointer-events: none;
`;
