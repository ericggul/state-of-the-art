import { FlexCenterStyle, WholeContainer, BackgroundBlur } from "@/styles";
import styled from "styled-components";

export const Bg = styled.div`
  ${BackgroundBlur}
`;

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  transform-origin: center;
`;

export const Tokens = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Token = styled.div`
  font-size: 0.8vw;
  font-weight: 500;
  color: white;
  width: 5vw;

  ${FlexCenterStyle}
  text-align: center;
  flex-direction: column;
`;

export const Inner = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  // color: #aaa;

  text-shadow: 0 0 0.5vw blue, 0 0 0.1vw blue;
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
