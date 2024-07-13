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
  font-size: 0.8vw;
  font-weight: 300;
  color: white;
  // font-weight: bold;
  padding: 0.1vw 0.25vw;
  width: 4vw;
  position: relative;

  ${FlexCenterStyle}
  text-align: center;
  flex-direction: column;
`;

export const Vector = styled.div`
  position: absolute;
  width: 100%;
  color: #aaa;
  font-size: 0.8vw;
  font-weight: 300;
  ${({ ispos }) => (ispos ? `top: 1.5vw` : `bottom: 1.5vw`)};
  display: flex;
  justify-content: center;
`;

export const Inner = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
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
