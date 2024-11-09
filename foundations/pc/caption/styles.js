import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color: #0f0;
  perspective: 2000px;
  overflow: hidden;
`;

export const GroupContainer = styled.div`
  margin-bottom: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const GroupTitle = styled.h2`
  font-size: 14px;
  margin-bottom: 5px;
  border-bottom: 1px solid #0f0;
  padding-bottom: 2px;
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.4vw, 1fr));
  gap: 0.5vw;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

export const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 1s ease;
  transform: ${(props) => `rotateY(${props.$rotation}deg)`};
  will-change: transform;
`;

export const CarouselItem = styled.div`
  position: absolute;
  width: 12vw;
  height: ${(12 * 9) / 16}vw;
  left: 50%;
  top: 50%;
  padding: 0.5vw;
  background-color: ${(props) => (props.$isHighlighted ? "#0f03" : "#0f01")};
  border: 0.05vw solid #0f0;
  border-radius: 0.5vw;
  transform-style: preserve-3d;
  transform: ${(props) => `
    translate(-50%, -50%)
    rotateY(${props.$angle}deg)
    translateZ(${props.$isHighlighted ? 80 : 60}vw)
    ${props.$isHighlighted ? "scale(2)" : "scale(1)"}
  `};
  transition: transform 0.5s ease, opacity 0.5s ease;
  opacity: ${(props) => (props.$isHighlighted ? 1 : 0.6)};
  box-shadow: ${(props) => (props.$isHighlighted ? "0 0 2vw #0f0" : "none")};
  will-change: transform;

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;

export const ModelName = styled.div`
  font-size: ${(props) => (props.$isHighlighted ? "1.5vw" : "1vw")};
  font-weight: bold;
  margin-bottom: 0.5vw;
  text-align: center;
  font-family: "Times New Roman", Times, serif;
`;

export const ModelVersion = styled.div`
  font-size: ${(props) => (props.$isHighlighted ? "1.2vw" : "0.8vw")};
  opacity: 0.7;
  text-align: center;
  font-family: "Times New Roman", Times, serif;
`;
