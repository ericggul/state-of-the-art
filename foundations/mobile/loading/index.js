"use client";

import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";
import { useRouter } from "next/navigation";

const LoadingContainer = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  position: fixed;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
  left: 0 !important;
`;

const TopVerticalLine = styled.div`
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

const BottomVerticalLine = styled.div`
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

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const Scanline = styled.div`
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
`;

const LoadingText = styled.div`
  font-family: var(--font-geist-mono), monospace;
  font-size: clamp(1rem, 4vw, 1.25rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  animation: ${pulse} 2s ease-in-out infinite;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  max-width: 80%;
  text-align: center;
`;

const ProgressContainer = styled.div`
  width: min(80%, 300px);
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1;
`;

const progress = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  animation: ${progress} 1.5s ease-in-out infinite;
`;

const ExplanationButton = styled.button`
  position: absolute;
  bottom: 2rem;
  padding: 0.8rem 1.6rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-family: var(--font-geist-mono), monospace;
  font-size: clamp(0.875rem, 3vw, 1rem);
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function Loading({
  customText = "Initialising Interface",
  isDeclined = false,
}) {
  const router = useRouter();

  const handleExplanationClick = () => {
    router.push("/");
  };

  return (
    <LoadingContainer>
      <TopVerticalLine />
      <BottomVerticalLine />
      <LoadingText>{customText}</LoadingText>
      <ProgressContainer>
        <ProgressBar />
      </ProgressContainer>
      {isDeclined && (
        <ExplanationButton onClick={handleExplanationClick}>
          Learn about the artwork
        </ExplanationButton>
      )}
    </LoadingContainer>
  );
}
