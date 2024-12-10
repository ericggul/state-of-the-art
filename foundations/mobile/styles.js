import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

// Reduce animations to bare minimum
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Add a new keyframe for ScrollHint that includes both fade in and out
const fadeInOut = keyframes`
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

export const Container = styled.div`
  ${WholeContainer}

  color: #fff;
  position: relative;
  overflow-x: hidden;
  padding-left: 48px;
  touch-action: pan-y pinch-zoom;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
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
    rgba(255, 255, 255, 0.3),
    transparent
  );
  height: ${({ theme }) => theme.windowHeight - 96}px;
  pointer-events: none;
`;

export const VerticalText = styled.div`
  font-size: 0.7rem;
  position: fixed;
  left: 24px;
  text-align: center;
  bottom: 18px;
  transform: translateX(-50%);
  color: white;
  max-width: 45px;
  animation: ${fadeIn} 0.5s ease-out both;
  animation-delay: 2.5s;
`;

export const ActiveDot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
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

  /* Optimize touch handling */
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;

  /* Enable hardware acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Add a subtle fade-in effect */
  animation: ${fadeIn} 1s ease-out both;
  animation-delay: 0.5s;
`;

export const ModelItem = styled.div`
  position: relative;
  width: 85%;
  margin-left: auto;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.5) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.5) 100%
  );
  border-radius: 0.5rem;
  height: ${({ $isCurrent }) => ($isCurrent ? "auto" : "4rem")};
  margin-bottom: 1rem;
  opacity: ${({ $isCurrent }) => ($isCurrent ? 1 : 0.6)};

  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  backdrop-filter: blur(0.6vw);
  -webkit-backdrop-filter: blur(0.6vw);

  box-shadow: ${(props) =>
    props.$isCurrent
      ? `0 0 2vw hsla(${props.$hue}, 100%, 75%, 0.2),
     inset 0 0 3vw hsla(${props.$hue}, 100%, 75%, 0.1)`
      : `0 0 1.5vw hsla(${props.$hue}, 100%, 75%, 0.1),
     inset 0 0 2vw hsla(${props.$hue}, 100%, 75%, 0.05)`};

  transform: translateX(
    ${({ $distance }) => {
      const absDistance = Math.abs($distance);
      if (absDistance === 0) return "0%";
      if (absDistance === 1) return "10%";
      return "20%";
    }}
  );

  transition: all 0.3s ease-in-out;
`;

export const ModelName = styled.h2`
  font-size: 1.2rem;
  margin: 0;
  transition: all 0.3s ease;
  max-width: 80%;
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.9);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2),
    0 0.1vw 0.2vw hsla(0, 0%, 0%, 0.3);
  letter-spacing: 0.02em;
  font-family: var(--font-geist-mono), monospace;
`;

export const ModelDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  line-height: 1.5;
  max-width: 80%;
  opacity: 0.8;
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.02em;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  padding-right: 10px;
  animation: ${fadeIn} 0.2s ease-out both;
  // animation-delay: 0.3s;

  p {
    margin: 0.5rem 0;
    padding-left: 1rem;
    position: relative;
    max-width: calc(100% - 1rem);

    /* Static line indicator */
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(
        to bottom,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
    }
  }
`;

export const ScrollHint = styled.div`
  pointer-events: none;
  position: fixed;
  bottom: 24px;
  left: 15%;
  padding: 12px 24px;
  background: linear-gradient(
    135deg,
    hsla(
        ${(props) => (props.$urgent ? "0" : props.$hue || 230)},
        ${(props) => (props.$urgent ? "80%" : "5%")},
        ${(props) => (props.$urgent ? "20%" : "10%")},
        0.3
      )
      0%,
    hsla(
        ${(props) => (props.$urgent ? "0" : props.$hue || 230)},
        ${(props) => (props.$urgent ? "85%" : "10%")},
        ${(props) => (props.$urgent ? "15%" : "5%")},
        0.3
      )
      100%
  );
  border: 1px solid
    hsla(
      ${(props) => (props.$urgent ? "0" : props.$hue || 230)},
      ${(props) => (props.$urgent ? "100%" : "0%")},
      ${(props) => (props.$urgent ? "75%" : "95%")},
      0.3
    );
  backdrop-filter: blur(1vw);
  -webkit-backdrop-filter: blur(1vw);

  font-size: 0.85rem;
  z-index: 100;

  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: all 2s ease-out;

  box-shadow: 0 0 1.5vw
    hsla(
      ${(props) => (props.$urgent ? "0" : props.$hue || 230)},
      ${(props) => (props.$urgent ? "100%" : "100%")},
      ${(props) => (props.$urgent ? "75%" : "75%")},
      0.1
    );
  font-family: var(--font-geist-mono), monospace;
  letter-spacing: 0.05em;
  border-radius: 0.2rem;
`;
