import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 35vh;
  background-color: #f0f0f0;
`;

export const TextDisplay = styled.div`
  font-size: 20px;
  color: #333;
  padding: 10px;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 18px;
  text-align: center;
  padding: 20px;
`;

export const StartButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }
`;

export const ThresholdContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 80%;
  max-width: 300px;
`;

export const ThresholdLabel = styled.div`
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const ThresholdSlider = styled.input`
  width: 100%;
  height: 40px;
  margin: 0;
  background: transparent;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: #007aff;
    margin-top: -8px;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    background: #ddd;
    border-radius: 4px;
  }

  &:focus {
    outline: none;
  }
`;

export const NextTextDisplay = styled.div`
  font-size: 18px;
  color: #666;
  padding: 5px 20px;
  text-align: center;
  margin-top: 5px;
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

export const NavButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #007aff;
  background: transparent;
  color: #007aff;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 122, 255, 0.1);
  }

  &:active {
    background-color: rgba(0, 122, 255, 0.2);
  }
`;

export const ScriptPosition = styled.div`
  font-size: 16px;
  color: #333;
`;
