import styled from "styled-components";

export const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

export const Controls = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
`;

export const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Title = styled.h1`
  color: #00ffff;
  font-size: 1.2rem;
  margin: 0;
`;

export const Label = styled.span`
  color: #00ffff;
  font-size: 0.9rem;
`;

export const Button = styled.button`
  background: ${(props) => (props.$active ? "#00ffff" : "#333")};
  color: ${(props) => (props.$active ? "#000" : "#fff")};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

  &:hover {
    background: ${(props) => (props.$active ? "#00dddd" : "#444")};
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  }
`;

export const BackButton = styled.button`
  background: transparent;
  color: #00ffff;
  border: 1px solid #00ffff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
  }
`;

export const Input = styled.input`
  background: #333;
  color: #00ffff;
  border: 1px solid #00ffff;
  padding: 0.5rem;
  border-radius: 4px;
  width: 80px;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

export const Viewport = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

export const LevelDisplay = styled.div`
  color: #00ffff;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  background: #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const SubLevel = styled.span`
  color: #00cccc;
  font-size: 0.8rem;
`;
