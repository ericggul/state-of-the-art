import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  background-color: #000;
  color: #fff;
  font-family: "Cardo", serif;
  position: relative;
  overflow-x: hidden;
  padding-left: 48px;
`;

export const VerticalLine = styled.div`
  position: fixed;
  left: 24px;
  top: 48px;
  bottom: 48px;
  width: 2px;
  background: rgba(255, 255, 255, 0.3);
  height: calc(100vh - 96px);
  overflow: hidden;
`;

export const ActiveDot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  top: ${({ $percentage }) => `${$percentage}%`};
  transition: top 0.3s ease;
`;

export const ModelList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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
  width: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    if (absDistance === 0) return "85%";
    if (absDistance === 1) return "75%";
    if (absDistance === 2) return "65%";
    return "55%";
  }};
  margin-left: auto;
  padding: 1.5rem;
  background: ${({ $isCurrent, $distance }) => {
    const absDistance = Math.abs($distance);
    if ($isCurrent) return "#222";
    if (absDistance === 1) return "#1a1a1a";
    if (absDistance === 2) return "#151515";
    return "#111";
  }};
  border-radius: 12px 0 0 12px;
  transition: all 0.3s ease;
  height: ${({ $isCurrent }) => ($isCurrent ? "auto" : "4rem")};
  margin-bottom: 1rem;
  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    if (absDistance === 0) return 1;
    if (absDistance === 1) return 0.8;
    if (absDistance === 2) return 0.6;
    return 0.4;
  }};
`;

export const ModelName = styled.h2`
  font-size: ${({ $isCurrent, $distance }) => {
    if ($isCurrent) return "1.5rem";
    const absDistance = Math.abs($distance);
    if (absDistance === 1) return "1.2rem";
    if (absDistance === 2) return "1rem";
    return "0.9rem";
  }};
  margin: 0;
  transition: font-size 0.3s ease;
  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    if (absDistance === 0) return 1;
    if (absDistance === 1) return 0.8;
    if (absDistance === 2) return 0.6;
    return 0.4;
  }};
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
