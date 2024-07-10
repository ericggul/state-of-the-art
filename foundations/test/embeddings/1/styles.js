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
  flex-wrap: wrap;
`;

export const Token = styled.span`
  margin: 0 0.1vw;
  font-size: 1vw;
  ${({ startswithspace }) => startswithspace && "margin-left: 1vw;"}
  color: white;
  font-weight: bold;
  padding: 0.1vw 0.25vw;
  position: relative;
`;

export const Vector = styled.div`
  position: absolute;
  width: 100%;
  color: white;
  font-size: 0.5vw;
  font-weight: 300;
  ${({ isPos }) => (isPos ? `top: 2vw` : `bottom: 2vw`)};
  display: flex;
  justify-content: center;
`;

export const Inner = styled.div`
  width: 2vw;
  text-align: center;
  position: relative;
`;

export const Overlay = styled.div`
  left: 0;
  position: absolute;
  width: 100vw;
  height: calc(50vh - 1vw);
  top: ${({ isPos }) => (isPos ? `calc(50vh + 1vw)` : "0")};
  background: linear-gradient(${({ isPos }) => (isPos ? 0 : 180)}deg, #000 13.85%, #fff 100%);
  mix-blend-mode: darken;
  -webkit-mix-blend-mode: darken;
`;
