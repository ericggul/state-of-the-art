import styled, { keyframes } from "styled-components";
import { animated } from "@react-spring/web";

const scanlineAnim = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const pulseGlow = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { opacity: 0.3; }
`;

export const Container = styled.div`
  display: flex;
  gap: 1vw;
  padding: 1.2vw;
  position: relative;
  width: calc(100% - 2.4vw);
  height: calc(100% - 2.4vw);
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 19vw;
  height: 100%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    z-index: 2;
  }
`;

export const ScanLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: ${scanlineAnim} 2s linear infinite;
  z-index: 3;
`;

export const GlowOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  animation: ${pulseGlow} 2s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
`;

export const AnimatedImage = styled(animated.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  will-change: transform, opacity, filter;
  transform-origin: center center;
  z-index: 1;
`;

export const Description = styled.div`
  font-size: 0.7vw;
  width: 10vw;
  margin-right: -0.5vw;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  hyphens: auto;
  max-height: 100%;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
`;
