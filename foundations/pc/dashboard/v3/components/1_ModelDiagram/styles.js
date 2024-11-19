import styled from "styled-components";
import { FlexCenterStyle } from "@/styles";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
  width: 100%;
  height: 100%;
`;

export const Layer = styled.div`
  width: 12vw;
  height: 3vw;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1vw;
  color: rgba(255, 255, 255, 0.9);
  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );
`;

export const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 0.5vw solid transparent;
  border-right: 0.5vw solid transparent;
  border-top: 0.8vw solid rgba(255, 255, 255, 0.3);
`;
