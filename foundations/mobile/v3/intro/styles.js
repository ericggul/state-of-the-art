import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const IntroContainer = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  background-color: #000;
  color: #fff;
  padding: clamp(1rem, 5vw, 2rem);
  min-height: 100vh;
  min-height: 100dvh; /* For mobile browsers with dynamic viewport */
  box-sizing: border-box;
`;

export const IntroForm = styled.form`
  ${FlexCenterStyle}
  flex-direction: column;
  gap: clamp(1.5rem, 4vw, 2rem);
  width: min(90%, 320px);
  margin: 0 auto;
`;

export const IntroContent = styled.div`
  ${FlexCenterStyle}
  flex-direction: column;
  gap: clamp(1.5rem, 4vw, 2rem);
  width: min(90%, 320px);
  margin: 0 auto;
  text-align: center;
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
  border: 2px solid #333;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  font-size: clamp(0.875rem, 4vw, 1rem);
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:focus {
    border-color: #fff;
  }

  &::placeholder {
    color: #666;
  }
`;

const BaseButton = styled.button`
  width: 100%;
  padding: clamp(0.75rem, 3vw, 1rem);
  border: none;
  border-radius: 8px;
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
  background: #333;

  &:hover:not(:disabled) {
    background: #444;
  }
`;

export const ActivateButton = styled(BaseButton)`
  background: #4caf50;

  &:hover:not(:disabled) {
    background: #45a049;
  }
`;
