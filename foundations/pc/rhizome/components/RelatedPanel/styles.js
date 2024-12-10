import styled, { keyframes } from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";
import { LINEWIDTH, LEFT, HEIGHT } from "@/foundations/pc/frame/full/styles";

const KEY_HUE = 230;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

export const LeftLine = styled.div`
  position: absolute;
  height: ${LINEWIDTH}vw;
  width: ${LEFT}vw;
  top: ${HEIGHT - 15}vh;
  left: ${LEFT}vw;
  background: linear-gradient(
    90deg,
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
    hsla(${(props) => props.$hue}, 100%, 75%, 0.2)
  );
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.4),
    0 0 3vw hsla(${(props) => props.$hue}, 100%, 50%, 0.2);
`;

export const RelatedPanel = styled.div`
  position: absolute;
  width: 25vw;
  height: 30vh;
  bottom: ${100 - HEIGHT - 3}vh;
  left: ${LEFT * 2}vw;
  padding: 1vw;

  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.5) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.5) 100%
  );
  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);

  backdrop-filter: blur(0.6vw);
  -webkit-backdrop-filter: blur(0.6vw);

  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
      transparent
    );
    animation: ${scanline} 2s linear infinite;
    opacity: 0.5;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      hsla(${(props) => props.$hue}, 40%, 100%, 0.03) 0%,
      transparent 50%
    );
    pointer-events: none;
  }

  box-shadow: 0 0 1.5vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1),
    inset 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.05);

  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
`;

export const PanelTitle = styled.div`
  position: absolute;
  font-size: 1vw;
  // font-weight: 500;
  left: ${LEFT * 2}vw;
  bottom: 40vh;
  width: 25vw;
  margin: 0;
  padding: 0;
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.9);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2),
    0 0.1vw 0.2vw hsla(0, 0%, 0%, 0.3);
  z-index: 2;
  transition: color 0.3s ease;

  &:hover {
    color: hsla(${(props) => props.$hue}, 20%, 98%, 0.95);
    text-shadow: 0 0 1.2vw hsla(${(props) => props.$hue}, 80%, 50%, 0.3),
      0 0.1vw 0.2vw hsla(0, 0%, 0%, 0.4);
  }
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
  padding-right: 0.8vw;
  border-radius: 2px;
  background: hsla(${(props) => props.$hue}, 15%, 10%, 0.5);
  border: 1px solid hsla(${(props) => props.$hue}, 30%, 85%, 0.1);
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.05);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  min-height: 2.5vw;
  flex-shrink: 0;
  backdrop-filter: blur(0.6vw);
  -webkit-backdrop-filter: blur(0.6vw);

  &::before {
    content: "└─";
    position: absolute;
    top: 0.4vw;
    left: 0.2vw;
    color: hsla(${(props) => props.$hue}, 30%, 95%, 0.4);
    font-size: 0.75vw;
  }

  &:hover {
    background: hsla(${(props) => props.$hue}, 20%, 5%, 0.8);
    border-color: hsla(${(props) => props.$hue}, 100%, 75%, 0.4);
    box-shadow: 0 0 2vw hsla(${(props) => props.$hue}, 100%, 75%, 0.2),
      inset 0 0 3vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1);
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
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.95);
  font-size: 0.85vw;
  letter-spacing: 0.02vw;
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2);
`;

export const ModelVersion = styled.div`
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.6);
  font-size: 0.7vw;
  padding: 0.1vw 0.3vw;
  background: hsla(${(props) => props.$hue}, 20%, 50%, 0.05);
  border-radius: 2px;
  border: 1px solid hsla(${(props) => props.$hue}, 30%, 85%, 0.1);
`;

export const RelationText = styled.div`
  color: hsla(${(props) => props.$hue}, 30%, 95%, 0.7);
  font-size: 0.75vw;
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
    hsla(${(props) => props.$hue}, 100%, 75%, ${(props) => props.$value * 0.8})
      0%,
    hsla(${(props) => props.$hue}, 100%, 75%, ${(props) => props.$value * 0.4})
      ${(props) => props.$value * 100}%,
    transparent 100%
  );
  box-shadow: 0 0 8px
    hsla(${(props) => props.$hue}, 100%, 75%, ${(props) => props.$value * 0.3});
`;
