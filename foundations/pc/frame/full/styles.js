import styled from "styled-components";
import { WholeContainer } from "@/styles";

export const LINEWIDTH = 0.15;
export const LEFT = 3;
export const TOP = 4;
export const HEIGHT = 92;
export const MARGIN = 5;
export const HORIZONTAL_LINE_MARGIN = 20;

export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
  z-index: 999;
  pointer-events: none;
`;

export const VerticalLine = styled.div`
  position: absolute;
  width: ${LINEWIDTH}vw;
  height: ${HEIGHT}vh;
  top: 0;
  left: ${LEFT}vw;
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  background: linear-gradient(
    180deg,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2)
  );
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4),
    0 0 3vw hsla(${(props) => props.$hue}, 100%, 50%, 0.2);
`;

export const HorizontalLine = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: ${(props) =>
    props.$width?.titleWidth + HORIZONTAL_LINE_MARGIN + 30 || 45}vw;
  top: ${TOP}vw;
  left: 0;
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  background: linear-gradient(
    90deg,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2)
  );
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4),
    0 0 3vw hsla(${(props) => props.$hue}, 100%, 50%, 0.2);
`;

export const HorizontalLine2 = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: 25vw;
  top: ${TOP}vw;
  right: ${MARGIN}vw;
  transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  background: linear-gradient(
    270deg,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2)
  );
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4),
    0 0 3vw hsla(${(props) => props.$hue}, 100%, 50%, 0.2);
`;

export const ModelTitle = styled.div`
  position: absolute;
  transition: all 0.3s ease-in-out;
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.9);
  left: ${LEFT + 2}vw;
  top: ${TOP}vw;
  padding: 0.3vw 1vw;
  transform: translateY(-50%);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2),
    0 0.1vw 0.2vw hsla(0, 0%, 0%, 0.3);
  ${(props) =>
    !props.$isCondensed &&
    `
    width: calc(100% - ${LEFT + 2}vw);
    padding: 0.3vw 1vw;
  `}
  backdrop-filter: blur(0.6vw);
  -webkit-backdrop-filter: blur(0.6vw);
  border-radius: 0;
  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.5) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.5) 100%
  );
  box-shadow: 0 0 1.5vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1),
    inset 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.05);

  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );

  &:hover {
    border-color: hsla(${(props) => props.$hue}, 100%, 75%, 0.4);
    box-shadow: 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
      inset 0 0 3vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1);
  }
`;

export const Title = styled.div`
  font-size: 3vw;
  position: relative;
  font-weight: bold;
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.9);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2),
    0 0.1vw 0.2vw hsla(0, 0%, 0%, 0.3);
`;

export const ModelType = styled.h2`
  font-size: 1vw;
  position: absolute;
  min-width: 15vw;
  right: 5vw;
  text-align: right;
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.3s ease-in-out;
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.7);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2),
    0 0.1vw 0.2vw hsla(0, 0%, 0%, 0.3);
`;
