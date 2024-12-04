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
  transition: color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.95);
  left: ${LEFT + 2}vw;
  top: ${TOP}vw;
  width: calc(100% - ${LEFT + 2}vw);
  padding: 0.3vw 1vw;
  transform: translateY(-50%);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 2vw;
`;

export const Title = styled.div`
  font-size: 3vw;
  position: relative;
  font-weight: bold;
`;

export const ModelType = styled.h2`
  font-size: 1vw;
  position: absolute;
  min-width: 15vw;
  right: 5vw;
  text-align: right;
  top: 50%;
  transform: translateY(-50%);
  transition: color 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.7);
`;
