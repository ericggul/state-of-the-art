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
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 2px;
  padding: 0.8vw;
  max-width: 24vw;
  height: 24vh;
  overflow: hidden;
  font-family: "Fira Code", monospace;
  font-size: 0.9vw;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(2px);

  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 2px;
    background: rgba(0, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.2);
  }
`;

export const PanelTitle = styled.div`
  color: #00ffff;
  font-size: 1vw;
  font-weight: 500;
  margin-bottom: 0.5vw;
  padding-bottom: 0.3vw;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
  flex-shrink: 0;
  opacity: 0.9;
`;

export const RelatedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  overflow-y: auto;
  padding-right: 0.3rem;
  flex-grow: 1;

  &::-webkit-scrollbar {
    width: 2px;
    background: rgba(0, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.2);
  }
`;

export const RelatedItem = styled.div`
  padding: 0.4vw;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${(props) => `rgba(0, 255, 255, ${props.$strength * 0.3})`};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  min-height: 3vw;
  flex-shrink: 0;

  &::before {
    content: "└─";
    position: absolute;
    top: 0.4vw;
    left: 0.2vw;
    color: rgba(0, 255, 255, 0.4);
    font-size: 0.85vw;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(0, 255, 255, ${(props) => props.$strength * 0.5});
  }
`;

export const ModelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  padding-left: 1rem;
`;

export const ModelName = styled.div`
  color: #00ffff;
  font-size: 0.95vw;
  letter-spacing: 0.02vw;
  opacity: 0.9;
`;

export const ModelVersion = styled.div`
  color: rgba(0, 255, 255, 0.6);
  font-size: 0.8vw;
  padding: 0.1vw 0.3vw;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 2px;
  border: 1px solid rgba(0, 255, 255, 0.1);
`;

export const RelationText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85vw;
  line-height: 1.3;
  margin: 0.2vw 0;
  padding-left: 1vw;
  font-family: monospace;
`;

export const ConnectionStrength = styled.div`
  height: 1px;
  margin-top: 0.4rem;
  margin-left: 1rem;
  background: linear-gradient(
    to right,
    rgba(0, 255, 255, ${(props) => props.$value * 0.8}) 0%,
    rgba(0, 255, 255, ${(props) => props.$value * 0.4})
      ${(props) => props.$value * 100}%,
    transparent 100%
  );
  box-shadow: 0 0 8px rgba(0, 255, 255, ${(props) => props.$value * 0.3});
`;
