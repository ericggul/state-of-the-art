import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  background: #000;
  transition: all 0.5s;

  img {
    width: 100%;
    height: 100%;
  }

  svg {
    z-index: 0;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  video {
    width: 100%;
    height: 100%;
  }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.2); }
  50% { box-shadow: 0 0 35px rgba(0, 255, 255, 0.4); }
  100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.2); }
`;

export const RelatedPanel = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.4);
  border-radius: 4px;
  padding: 1.8rem;
  max-width: 400px;
  height: 33vh;
  overflow: hidden;
  animation: ${glowAnimation} 2s infinite;
  backdrop-filter: blur(1px);
  font-family: monospace;
  z-index: 1000;
  display: flex;
  flex-direction: column;

  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 4px;
    background: rgba(0, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.3);
    border-radius: 2px;
  }

  box-shadow: inset 0 0 30px rgba(0, 255, 255, 0.1);
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
  background: ${(props) => `rgba(0, 255, 255, ${props.$strength * 0.03})`};
  border: 1px solid ${(props) => `rgba(0, 255, 255, ${props.$strength * 0.4})`};
  backdrop-filter: blur(4px);
  transform: perspective(1000px) translateZ(0);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 60px;
  flex-shrink: 0;

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

  &:hover {
    transform: perspective(1000px) translateZ(5px);
    background: ${(props) => `rgba(0, 255, 255, ${props.$strength * 0.05})`};
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
  font-size: 1.1em;
  letter-spacing: 0.5px;
  text-shadow: 0 0 12px rgba(0, 255, 255, 0.4);
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
  height: 3px;
  margin-top: 0.8rem;
  background: linear-gradient(
    to right,
    rgba(0, 255, 255, ${(props) => props.$value * 1.2}) 0%,
    rgba(0, 255, 255, ${(props) => props.$value * 0.6})
      ${(props) => props.$value * 100}%,
    transparent 100%
  );
  box-shadow: 0 0 15px rgba(0, 255, 255, ${(props) => props.$value * 0.6});
`;
