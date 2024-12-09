import styled, { keyframes } from "styled-components";
import { animated } from "@react-spring/web";

const pulseGlow = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { opacity: 0.3; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: calc(100% - 2.4vw);
  height: calc(100% - 2.4vw);
  padding: 1.2vw;
  gap: 0.8vw;
`;

export const AnimatedLayer = styled(animated.div)`
  position: relative;
  width: 12vw;
  height: 3vw;
  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.5) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.5) 100%
  );
  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  overflow: hidden;
  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
      transparent
    );
    animation: ${scanline} 2s linear infinite;
    opacity: 0.5;
  }
`;

export const LayerContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1vw;
  color: hsla(${(props) => props.$hue}, 15%, 98%, 1);
  text-shadow: 0 0 5px hsla(${(props) => props.$hue}, 100%, 75%, 0.5);
  z-index: 2;
`;

export const LayerGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.15) 0%,
    transparent 70%
  );
  animation: ${pulseGlow} 2s ease-in-out infinite;
  pointer-events: none;
`;

export const AnimatedArrow = styled(animated.div)`
  width: 0;
  height: 0;
  border-left: 0.5vw solid transparent;
  border-right: 0.5vw solid transparent;
  border-top: 0.8vw solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  filter: drop-shadow(0 0 0.8vw hsla(${(props) => props.$hue}, 100%, 75%, 0.2));
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: -0.8vw;
    left: -0.5vw;
    width: 1vw;
    height: 0.8vw;
    background: linear-gradient(
      to bottom,
      hsla(${(props) => props.$hue}, 100%, 75%, 0.1),
      transparent
    );
    animation: ${pulseGlow} 2s ease-in-out infinite;
    animation-delay: ${(props) => props.$index * 0.2}s;
  }
`;
