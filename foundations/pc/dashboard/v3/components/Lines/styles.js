import styled from "styled-components";
import { WholeContainer } from "@/styles";

const KEY_HUE = 230;

export const LINEWIDTH = 0.15;
export const LEFT = 3;
export const TOP = 4;
export const HEIGHT = 92;

export const Container = styled.div`
  ${WholeContainer}
  position: fixed;
  background: transparent;
  pointer-events: none;
`;

export const DiagonalLine = styled.div`
  position: absolute;
  width: 10vw;
  height: ${LINEWIDTH}vw;
  top: 60vh;
  left: 23vw;
  background: linear-gradient(
    90deg,
    hsla(${KEY_HUE}, 100%, 75%, 0.4),
    hsla(${KEY_HUE}, 100%, 75%, 0.8),
    hsla(${KEY_HUE}, 100%, 75%, 0.4)
  );
  box-shadow: 0 0 1vw hsla(${KEY_HUE}, 100%, 75%, 0.6),
    0 0 3vw hsla(${KEY_HUE}, 100%, 50%, 0.4);
  transform: translate(-50%, -50%) rotate(-50deg);
`;

export const HorizontalLine = styled.div`
  position: absolute;
  width: 50vw;
  height: ${LINEWIDTH}vw;
  bottom: 24vh;
  left: 20vw;
  background: linear-gradient(
    90deg,
    hsla(${KEY_HUE}, 100%, 75%, 0.4),
    hsla(${KEY_HUE}, 100%, 75%, 0.8),
    hsla(${KEY_HUE}, 100%, 75%, 0.4)
  );
  box-shadow: 0 0 1vw hsla(${KEY_HUE}, 100%, 75%, 0.6),
    0 0 3vw hsla(${KEY_HUE}, 100%, 50%, 0.4);
`;

export const HorizontalLine2 = styled.div`
  position: absolute;
  width: 80vw;
  height: ${LINEWIDTH}vw;
  top: 38vh;
  left: ${LEFT}vw;
  background: linear-gradient(
    90deg,
    hsla(${KEY_HUE}, 100%, 75%, 0.4),
    hsla(${KEY_HUE}, 100%, 75%, 0.8),
    hsla(${KEY_HUE}, 100%, 75%, 0.4)
  );
  box-shadow: 0 0 1vw hsla(${KEY_HUE}, 100%, 75%, 0.6),
    0 0 3vw hsla(${KEY_HUE}, 100%, 50%, 0.4);
`;
