import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 30vh;
  background-color: #f0f0f0;
`;

export const TextDisplay = styled.div`
  font-size: 24px;
  color: #333;
  padding: 20px;
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
