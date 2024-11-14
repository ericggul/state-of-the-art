import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

// Function to convert pixels to viewport width units for responsiveness
const vw = (px) => `${(px / 390) * 100}vw`;

// Main container that fills the viewport
export const Container = styled.div`
  ${WholeContainer}
  ${FlexCenterStyle}
  flex-direction: column;
  background-color: #000;
  color: #fff;
  font-family: "Cardo", serif;
`;

// Model list container
export const ModelList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: y mandatory;
  scroll-padding: 50% 0;
`;

// Individual model item
export const ModelItem = styled.div`
  ${FlexCenterStyle}
  flex-direction: column;
  width: 100%;
  min-height: ${({ $isCurrent }) => ($isCurrent ? "50vh" : "7rem")};
  max-height: ${({ $isCurrent }) => ($isCurrent ? "50vh" : "7rem")};
  transition: all 0.3s ease;
  background-color: ${({ $isCurrent }) => ($isCurrent ? "#222" : "#000")};
  color: #fff;
  padding: 1rem;
  box-sizing: border-box;
  scroll-snap-align: center;
  overflow: hidden;
`;

// Model name styling
export const ModelName = styled.h2`
  font-size: 1.2rem;
  margin: 0;
  text-align: center;
`;

// Model details for the expanded item
export const ModelDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
  padding: 0 1rem;
`;
