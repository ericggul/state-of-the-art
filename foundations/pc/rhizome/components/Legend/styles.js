import styled from "styled-components";
import { LEFT, HEIGHT } from "@/foundations/pc/frame/full/styles";

export const LegendContainer = styled.div`
  position: absolute;
  width: 15vw;
  bottom: ${100 - HEIGHT - 3}vh;
  right: ${LEFT}vw;
  padding: 1vw;

  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.5) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.5) 100%
  );
  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);

  backdrop-filter: blur(0.1vw);
  -webkit-backdrop-filter: blur(0.1vw);

  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );

  box-shadow: 0 0 1.5vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1),
    inset 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.05);
`;

export const Title = styled.div`
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.95);
  font-size: 0.85vw;
  letter-spacing: 0.02vw;
  margin-bottom: 1vw;
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2);
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5vw 0;
  //   padding-left: 0.5vw;
`;

export const IndicatorWrapper = styled.div`
  width: 3vw;
  display: flex;
  align-items: center;

  justify-content: center;
`;

export const Circle = styled.div`
  width: 0.8vw;
  height: 0.8vw;
  border-radius: 50%;
  box-sizing: border-box;

  ${(props) =>
    props.$type === "other" &&
    `
    width: 0.3vw;
    height: 0.3vw;
    background: hsla(${props.$hue}, 100%, 75%, 0.3);
  `}

  ${(props) =>
    props.$type === "node" &&
    `
    background: hsla(${props.$hue}, 100%, 75%, 0.3);
    border: 1px solid hsla(${props.$hue}, 100%, 75%, 0.5);
  `}

  ${(props) =>
    props.$type === "highlight" &&
    `
    background: hsla(${props.$hue}, 100%, 75%, 0.8);
    box-shadow: 0 0 1vw hsla(${props.$hue}, 100%, 75%, 0.4);
  `}
`;

export const Line = styled.div`
  width: 1.5vw;
  height: 1px;

  ${(props) =>
    props.$type === "connection" &&
    `
    background: hsla(${props.$hue}, 100%, 75%, 0.5);
  `}

  ${(props) =>
    props.$type === "strength" &&
    `
    background: linear-gradient(
      to right,
      hsla(${props.$hue}, 100%, 75%, 0.8),
      transparent
    );
  `}
`;

export const Text = styled.div`
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.7);
  font-size: 0.75vw;
  letter-spacing: 0.02vw;
`;
