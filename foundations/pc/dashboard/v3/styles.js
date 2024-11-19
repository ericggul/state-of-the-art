import styled from "styled-components";
import { WholeContainer } from "@/styles";

import { LINEWIDTH, LEFT, HEIGHT } from "@/foundations/pc/frame/styles";

export const Container = styled.div`
  ${WholeContainer}
  background: #000;
  padding: 4vw;
  padding-top: 6vw;
`;

export const Header = styled.div`
  position: relative;
  margin-left: 3vw;
  margin-bottom: 2vw;
`;

export const Title = styled.h1`
  font-size: 5vw;
  margin: 0;
  padding: 0;
`;

export const Subtitle = styled.h2`
  font-size: 1.5vw;
  opacity: 0.7;
  margin: 0;
  padding: 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  gap: 2vw;
  position: relative;
`;

export const Card = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2vw;
  min-height: 20vh;

  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border: 1px solid transparent;
    pointer-events: none;
    clip-path: polygon(
      0 0,
      calc(100% - 2vw) 0,
      100% 2vw,
      100% 100%,
      2vw 100%,
      0 calc(100% - 2vw)
    );
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.8vw;
  margin: 0 0 1.5vw 0;
  padding: 0;
  color: rgba(255, 255, 255, 0.9);
`;
