import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

// Add new animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

// Update the letterAppear animation
const letterAppear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Add scanline effect
export const Scanline = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: ${scanline} 2s linear infinite;
  z-index: 0;
`;

export const IntroContainer = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background-color: #000;
  color: #fff;
  padding: 0;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  font-family: var(--font-geist-mono), monospace;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

export const IntroForm = styled.form`
  ${FlexCenterStyle}
  flex-direction: column;
  gap: clamp(2.5rem, 6vw, 3rem);
  width: min(90%, 320px);
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out;
`;

export const IntroContent = styled.div`
  ${FlexCenterStyle}
  flex-direction: column;
  gap: clamp(2.5rem, 6vw, 3rem);
  width: min(90%, 320px);
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out;
`;

export const TopVerticalLine = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 30vh;
  background-color: #fff;
  opacity: 0.8;
  z-index: 0;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 10vh;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    pointer-events: none;
  }
`;

export const BottomVerticalLine = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 30vh;
  background-color: #fff;
  opacity: 0.8;
  z-index: 0;
  pointer-events: none;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 10vh;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    pointer-events: none;
  }
`;

export const IntroTitle = styled.h1`
  font-size: clamp(1.25rem, 5vw, 1.5rem);
  margin: 0;
  text-align: center;
  line-height: 1.3;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  letter-spacing: 0.05em;
`;

export const IntroText = styled.p`
  font-size: clamp(0.875rem, 4vw, 1rem);
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;
  letter-spacing: 0.02em;
`;

export const IntroInput = styled.input`
  width: 100%;
  padding: clamp(0.75rem, 3vw, 1rem);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  touch-action: manipulation;
  -webkit-text-size-adjust: 100%;

  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  ${(props) =>
    props["aria-invalid"] &&
    `
    border-color: #ff4444;
    
    &:focus {
      border-color: #ff4444;
      box-shadow: 0 0 15px rgba(255, 68, 68, 0.1);
    }
  `}
`;

const BaseButton = styled.button`
  width: 100%;
  padding: clamp(0.75rem, 3vw, 1rem);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: clamp(0.875rem, 4vw, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.05em;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: 0.5s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const IntroButton = styled(BaseButton)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }
`;

export const ActivateButton = styled(BaseButton)`
  background: linear-gradient(45deg, #4caf50, #45a049);
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);

  &:hover:not(:disabled) {
    background: linear-gradient(45deg, #45a049, #4caf50);
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: clamp(0.75rem, 3vw, 0.875rem);
  margin: 0.5rem 0 0;
  text-align: left;
  width: 100%;
`;

export const AnimatedText = styled.span`
  display: inline-block;
  opacity: 0;
  animation: ${letterAppear} 0.3s ease-out forwards;
  animation-delay: ${(props) => props.$delay}s;
  will-change: transform, opacity;
`;
