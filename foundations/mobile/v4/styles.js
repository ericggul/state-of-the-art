import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

// Update animations
const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.98) translateY(10px);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
`;

const fadeInAndOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(4px);
  }
  15% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  85% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(4px);
  }
`;

export const Container = styled.div`
  ${WholeContainer}
  background-color: #000;
  color: #fff;
  position: relative;
  overflow-x: hidden;
  padding-left: 48px;
  touch-action: pan-y pinch-zoom;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  /* Prevent iOS Safari zoom */
  touch-action: manipulation;
  -ms-touch-action: manipulation;

  /* Additional iOS specific rules */
  -webkit-text-size-adjust: 100%;
  -moz-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  text-size-adjust: 100%;
`;

export const VerticalLine = styled.div`
  position: fixed;
  left: 24px;
  top: 48px;
  bottom: 48px;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  height: ${({ theme }) => theme.windowHeight - 96}px;
  pointer-events: none;
  animation: ${fadeInScale} 0.5s ease-out both;
  animation-delay: 2s;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    filter: blur(1px);
  }
`;

export const VerticalText = styled.div`
  font-size: 12px;
  position: fixed;
  left: 12px;$
  text-align: center;
  bottom: 18px;
  transform: translateX(-50%);
  color: white;
  max-width: 45px;
  animation: ${fadeInScale} 0.5s ease-out both;
  animation-delay: 2.5s;
`;

export const ActiveDot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: ${({ $position }) => `${$position.height}%`};
  background: #fff;
  border-radius: 4px;
  top: ${({ $position }) => `${$position.top}%`};
  transition: all 0.3s ease;
`;

export const ModelList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20vh 0;
  box-sizing: border-box;
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  animation: ${fadeInScale} 1s ease-out both;
  animation-delay: 0.5s;
`;

export const ModelItem = styled.div`
  position: relative;
  width: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    if (absDistance === 0) return "85%";
    if (absDistance === 1) return "75%";
    if (absDistance === 2) return "65%";
    return "55%";
  }};
  margin-left: auto;
  padding: 1.5rem;
  background: ${({ $isCurrent, $distance }) => {
    const absDistance = Math.abs($distance);
    if ($isCurrent) return "rgba(40, 40, 40, 0.9)";
    if (absDistance === 1) return "rgba(30, 30, 30, 0.8)";
    if (absDistance === 2) return "rgba(20, 20, 20, 0.7)";
    return "rgba(15, 15, 15, 0.6)";
  }};
  border-radius: 12px 0 0 12px;
  transition: width 0.3s ease, background 0.3s ease;
  height: ${({ $isCurrent }) => ($isCurrent ? "auto" : "4rem")};
  margin-bottom: 1rem;
  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    if (absDistance === 0) return 1;
    if (absDistance === 1) return 0.8;
    if (absDistance === 2) return 0.6;
    return 0.4;
  }};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

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
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }
`;

export const ModelName = styled.h2`
  font-size: ${({ $isCurrent, $distance }) => {
    if ($isCurrent) return "1.5rem";
    const absDistance = Math.abs($distance);
    if (absDistance === 1) return "1.2rem";
    if (absDistance === 2) return "1rem";
    return "0.9rem";
  }};
  margin: 0;
  transition: all 0.3s ease;
  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    if (absDistance === 0) return 1;
    if (absDistance === 1) return 0.8;
    if (absDistance === 2) return 0.6;
    return 0.4;
  }};
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  letter-spacing: 0.02em;
  font-family: var(--font-geist-mono), monospace;
`;

export const ModelDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.02em;

  p {
    margin: 0.5rem 0;
    padding-left: 1rem;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export const ScrollHint = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 14px;
  pointer-events: none;
  z-index: 100;
  backdrop-filter: blur(10px);
  white-space: nowrap;
  max-width: 90%;
  animation: ${fadeInAndOut} 7s ease-out both;
  animation-delay: 1.5s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.05em;
`;
