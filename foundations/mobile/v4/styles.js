import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  background-color: #000;
  color: #fff;
  font-family: "Cardo", serif;
  position: relative;
  overflow: hidden;
`;

export const VerticalLine = styled.div`
  position: fixed;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.3);
`;

export const ActiveDot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  top: ${({ $position }) => $position}px;
  transition: top 0.3s ease;
`;

export const ModelList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20vh 0;
  box-sizing: border-box;

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ModelItem = styled.div`
  position: relative;
  width: 85%;
  margin-left: auto;
  padding: 1.5rem;
  background: ${({ $isCurrent }) => ($isCurrent ? "#222" : "#1a1a1a")};
  border-radius: 12px 0 0 12px;
  transition: all 0.3s ease;
  transform: translateX(${({ $isCurrent }) => ($isCurrent ? "0" : "15%")});
  height: ${({ $isCurrent }) => ($isCurrent ? "auto" : "4rem")};
  margin-bottom: 1rem;
`;

export const ModelName = styled.h2`
  font-size: ${({ $isCurrent }) => ($isCurrent ? "1.5rem" : "1.2rem")};
  margin: 0;
  transition: font-size 0.3s ease;
`;

export const ModelDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;

  p {
    margin: 0.5rem 0;
  }
`;
