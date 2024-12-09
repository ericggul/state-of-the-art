import styled, { css } from "styled-components";
import { WholeContainer } from "@/styles";

export const LINEWIDTH = 0.15;
export const LEFT = 3;
export const TOP = 4;
export const HEIGHT = 92;

export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
  pointer-events: none;
  // z-index: 1;
`;

const commonLineStyles = css`
  position: absolute;
  height: ${LINEWIDTH}vw;
  transition: all 0.3s ease-in-out;
  background: linear-gradient(
    90deg,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2)
  );
  box-shadow: 0 0 1.5vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1),
    inset 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.05);

  &:hover {
    box-shadow: 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
      inset 0 0 3vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1);
  }
`;

export const DiagonalLine = styled.div`
  ${commonLineStyles}
  width: 10vw;
  top: 60vh;
  left: 23vw;
  transform: translate(-50%, -50%) rotate(-50deg);
`;

export const HorizontalLine = styled.div`
  ${commonLineStyles}
  width: 50vw;
  bottom: 24vh;
  left: 20vw;
`;

export const HorizontalLine2 = styled.div`
  ${commonLineStyles}
  width: 80vw;
  top: 38vh;
  left: ${LEFT}vw;
`;
