import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

const HUE = 220;

export const Container = styled.div`
  ${WholeContainer}
  background: radial-gradient(
    circle at top right,
    hsla(${HUE}, 30%, 3%, 1),
    hsla(${HUE}, 30%, 1%, 1)
  );
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
  background: hsla(${HUE}, 10%, 95%, 0.35);
  height: calc(100vh - 96px);
  overflow: hidden;
`;

export const ActiveDot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: hsla(${HUE}, 10%, 95%, 1);
  border-radius: 50%;
  top: ${({ $percentage }) => `${$percentage}%`};
  transition: top 0.3s ease;
  box-shadow: 0 0 10px 0 hsla(${HUE}, 19%, 95%, 0.4);
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
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin-left: auto;
  padding: 1.5rem;
  background: ${({ $isCurrent, $distance }) => {
    const absDistance = Math.abs($distance);
    if ($isCurrent) return `hsla(${HUE}, 35%, 15%, 0.5)`;
    if (absDistance === 1) return `hsla(${HUE}, 30%, 12%, 0.5)`;
    if (absDistance === 2) return `hsla(${HUE}, 25%, 10%, 0.5)`;
    return `hsla(${HUE}, 20%, 8%, 0.8)`;
  }};

  box-shadow: inset 0 0 30px 0 hsla(${HUE}, 50%, 95%, 0.07),
    0 4px 24px -1px hsla(${HUE}, 40%, 2%, 0.25);

  backdrop-filter: blur(8px);

  border: 1px solid hsla(${HUE}, 40%, 95%, 0.08);

  &:hover {
    background: hsla(${HUE}, 40%, 18%, 0.6);
    border-color: hsla(${HUE}, 50%, 95%, 0.12);
    box-shadow: inset 0 0 30px 0 hsla(${HUE}, 60%, 95%, 0.09),
      0 4px 24px -1px hsla(${HUE}, 50%, 2%, 0.3);
  }

  border-radius: 12px 0 0 12px;
  transition: all 0.3s ease;
  height: ${({ $isCurrent, $distance }) => ($isCurrent ? "auto" : "2rem")};
  margin-bottom: -1.5rem;
  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    return Math.max(1 - absDistance * 0.2, 0.0);
  }};

  transform-origin: right center;
  will-change: transform, width, opacity;
  transform: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    return `translateX(${absDistance * 5}%) scale(${
      absDistance === 0
        ? 1
        : 0.95 - 0 * Math.max(0.95 - absDistance * 0.06, 0.8)
    })`;
  }};

  z-index: ${({ $distance }) => 10 - Math.min(Math.abs($distance), 3)};
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
  background: linear-gradient(
    to right,
    hsla(${HUE}, 30%, 95%, 1),
    hsla(${HUE}, 20%, 90%, 0.9)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
