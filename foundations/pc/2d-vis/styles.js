import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background-color: #000000;
  color: #00ffff;
  font-family: "Orbitron", sans-serif;
`;

export const SVGContainer = styled.svg`
  width: 100%;
  height: 100vh;
`;

export const NoDataMessage = styled.div`
  font-size: 1.5vw;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
`;
