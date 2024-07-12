import { FlexCenterStyle, WholeContainer } from "@/styles";
import styled from "styled-components";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background: black;
  flex-direction: column;
`;

export const Tokens = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  position: absolute;
  bottom: 10vh;
  width: 100%;
  left: 0;
`;

export const Token = styled.span`
  margin: 0 0.1vw;
  font-size: 1vw;
  width: 5vw;
  color: white;
  font-weight: bold;
  padding: 0.1vw 0.25vw;
  ${({ startswithspace }) => startswithspace && "margin-left: 1vw;"}
  position: relative;

  ${FlexCenterStyle}
  flex-direction: column;
`;

export const Vector = styled.div`
  position: absolute;
  width: 100%;
  color: white;
  font-size: 0.7vw;
  font-weight: 300;
  bottom: 10vh;
  display: flex;
  justify-content: center;

  white-space: pre-wrap;
  text-align: center;
`;

export const Graph = styled.div`
  width: 3vw;
  height: 70vh;
  box-sizing: border-box;
  text-align: center;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: flex-end; // Align items at the bottom
`;

export const El = styled.div`
  width: 100%;
  height: ${({ percentage }) => percentage}%;

  // border: 0.02vw solid white;
  box-sizing: content-box;

  ${FlexCenterStyle}
  flex-direction: column;

  text-align: center;
`;

export const Overlay = styled.div`
  left: 0;
  position: absolute;
  width: 100vw;
  height: calc(50vh - 1vw);
  top: ${({ ispos }) => (ispos ? `calc(50vh + 1vw)` : "0")};
  background: linear-gradient(${({ ispos }) => (ispos ? 0 : 180)}deg, #000 13.85%, #fff 100%);
  mix-blend-mode: darken;
  -webkit-mix-blend-mode: darken;
`;
