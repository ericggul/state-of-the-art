import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  background: #000;
  transition: all 0.5s;

  svg {
    z-index: 0;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.5); }
  100% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); }
`;

export const RelatedPanel = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #00ffff;
  border-radius: 4px;
  padding: 1.5rem;
  max-width: 400px;
  height: 33vh;
  overflow: hidden;
  animation: ${glowAnimation} 2s infinite;
  backdrop-filter: blur(5px);
  font-family: monospace;
  z-index: 1000;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 4px;
    background: rgba(0, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

export const PanelTitle = styled.div`
  color: #00ffff;
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  flex-shrink: 0;
`;

export const RelatedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  flex-grow: 1;

  &::-webkit-scrollbar {
    width: 4px;
    background: rgba(0, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

export const RelatedItem = styled.div`
  padding: 0.8rem;
  border-radius: 4px;
  background: ${(props) => `rgba(0, 255, 255, ${props.$strength * 0.02})`};
  border: 1px solid ${(props) => `rgba(0, 255, 255, ${props.$strength * 0.3})`};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 90px;
  flex-shrink: 0;

  &:hover {
    transform: translateX(-5px);
    background: ${(props) => `rgba(0, 255, 255, ${props.$strength * 0.04})`};
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: ${(props) => `rgba(0, 255, 255, ${props.$strength})`};
    box-shadow: 0 0 10px ${(props) => `rgba(0, 255, 255, ${props.$strength})`};
  }
`;

export const ModelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const ModelName = styled.div`
  color: #00ffff;
  font-weight: bold;
  font-size: 1em;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
`;

export const ModelVersion = styled.div`
  color: rgba(0, 255, 255, 0.7);
  font-size: 0.8em;
  padding: 0.2em 0.5em;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 3px;
  border: 1px solid rgba(0, 255, 255, 0.2);
`;

export const RelationText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85em;
  line-height: 1.4;
  margin: 0.4rem 0;
  padding-left: 0.5rem;
`;

export const ConnectionStrength = styled.div`
  height: 2px;
  margin-top: 0.8rem;
  background: linear-gradient(
    to right,
    rgba(0, 255, 255, ${(props) => props.$value}) 0%,
    rgba(0, 255, 255, ${(props) => props.$value * 0.5})
      ${(props) => props.$value * 100}%,
    transparent 100%
  );
  box-shadow: 0 0 10px rgba(0, 255, 255, ${(props) => props.$value * 0.5});
`;
