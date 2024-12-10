import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  min-height: 100vh;
  background: #f5f5f5;
  cursor: pointer;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const StatusItem = styled.p`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #666;
`;

export const StatusIndicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${({ $active }) => ($active ? "#4CAF50" : "#ff5252")};
`;

export const Content = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ResetButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #ff0000;
  }
`;
