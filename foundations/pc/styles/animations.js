import { keyframes } from "styled-components";

export const shadowPulse = keyframes`
  0% {
    box-shadow: inset 0 -2rem 3rem hsla(var(--hue), 100%, 40%, 0.1);
  }
  50% {
    box-shadow: inset 0 -2.5rem 4rem hsla(var(--hue), 100%, 40%, 0.15);
  }
  100% {
    box-shadow: inset 0 -2rem 3rem hsla(var(--hue), 100%, 40%, 0.1);
  }
`;
