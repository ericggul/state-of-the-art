import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";
import { LINEWIDTH, LEFT, HEIGHT } from "@/foundations/pc/frame/full/styles";

const KEY_HUE = 300;

export const LeftLine = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: ${LEFT}vw;
  top: ${HEIGHT - 15}vh;
  left: ${LEFT}vw;
  background: hsla(${KEY_HUE}, 100%, 75%, 0.5);
`;

export const RelatedPanel = styled.div`
  position: absolute;
  max-width: 30vw;
  height: 30vh;
  bottom: ${100 - HEIGHT - 3}vh;
  left: ${LEFT * 2}vw;
  border: ${LINEWIDTH}vw solid hsla(${KEY_HUE}, 100%, 75%, 0.5);
  padding: 1vw;

  border-radius: 0 0 3vw 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    clip-path: polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%);
    z-index: -1;
  }

  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 2px;
    background: hsla(${KEY_HUE}, 100%, 100%, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: hsla(${KEY_HUE}, 100%, 100%, 0.2);
  }
`;

export const PanelTitle = styled.div`
  position: absolute;
  top: -4vh;
  left: 0;
  width: 100%;
  color: hsla(${KEY_HUE}, 30%, 95%, 0.95);
  font-size: 1vw;
  flex-shrink: 0;
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
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const RelatedItem = styled.div`
  padding: 0.4vw 0.5vw;
  padding-right: 1vw;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  min-height: 3vw;
  flex-shrink: 0;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);

  &::before {
    content: "└─";
    position: absolute;
    top: 0.4vw;
    left: 0.2vw;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.85vw;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, ${(props) => props.$strength * 0.5});
  }
`;

export const ModelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  padding-left: 1.2vw;
`;

export const ModelName = styled.div`
  color: #ffffff;
  font-size: 0.95vw;
  letter-spacing: 0.02vw;
  opacity: 0.9;
`;

export const ModelVersion = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8vw;
  padding: 0.1vw 0.3vw;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const RelationText = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85vw;
  line-height: 1.3;
  margin: 0.2vw 0;
  padding-left: 1.2vw;
`;

export const ConnectionStrength = styled.div`
  height: 1px;
  margin-top: 0.4rem;
  margin-left: 1.2vw;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, ${(props) => props.$value * 0.8}) 0%,
    rgba(255, 255, 255, ${(props) => props.$value * 0.4})
      ${(props) => props.$value * 100}%,
    transparent 100%
  );
  box-shadow: 0 0 8px rgba(255, 255, 255, ${(props) => props.$value * 0.3});
`;
