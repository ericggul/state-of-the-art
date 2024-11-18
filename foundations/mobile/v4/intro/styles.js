import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

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
`;

export const IntroForm = styled.form`
  ${FlexCenterStyle}
  flex-direction: column;
  gap: clamp(2.5rem, 6vw, 3rem);
  width: min(90%, 320px);
  margin: 0 auto;
  position: relative;
  z-index: 1;
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
`;

export const IntroText = styled.p`
  font-size: clamp(0.875rem, 4vw, 1rem);
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;
`;

export const IntroInput = styled.input`
  width: 100%;
  padding: clamp(0.75rem, 3vw, 1rem);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: clamp(0.875rem, 4vw, 1rem);
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
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
  transition: background 0.3s, transform 0.2s;
  -webkit-tap-highlight-color: transparent;

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

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const ActivateButton = styled(BaseButton)`
  background: #4caf50;

  &:hover:not(:disabled) {
    background: #45a049;
  }
`;

export const ErrorMessage = styled.p`
  color: #ff4444;
  font-size: clamp(0.75rem, 3vw, 0.875rem);
  margin: 0.5rem 0 0;
  text-align: left;
  width: 100%;
`;
