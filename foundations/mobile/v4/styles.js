import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

// Add new animation
const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
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
  background: rgba(255, 255, 255, 0.3);
  height: ${({ theme }) => theme.windowHeight - 96}px;
  // overflow: hidden;
  pointer-events: none;
  animation: ${fadeInScale} 0.5s ease-out both;

  animation-delay: 2s;
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
    if ($isCurrent) return "#222";
    if (absDistance === 1) return "#1a1a1a";
    if (absDistance === 2) return "#151515";
    return "#111";
  }};
  border-radius: 12px 0 0 12px;
  transition: all 0.3s ease;
  height: ${({ $isCurrent }) => ($isCurrent ? "auto" : "4rem")};
  margin-bottom: 1rem;
  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    if (absDistance === 0) return 1;
    if (absDistance === 1) return 0.8;
    if (absDistance === 2) return 0.6;
    return 0.4;
  }};

  will-change: transform, opacity;
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
  transition: font-size 0.3s ease;
  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    if (absDistance === 0) return 1;
    if (absDistance === 1) return 0.8;
    if (absDistance === 2) return 0.6;
    return 0.4;
  }};
`;

export const ModelDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;

  p {
    margin: 0.5rem 0;
  }
`;

export const ScrollHint = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-size: 14px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(20px)"};
  transition: all 0.5s ease;
  pointer-events: none;
  z-index: 100;
  backdrop-filter: blur(4px);
  white-space: nowrap;
  max-width: 90%;

  animation: ${fadeInScale} 1s ease-out both;
  animation-delay: 1.5s;
`;
