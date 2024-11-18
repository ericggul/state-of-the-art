import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

const HUE = 220;
const ACCENT_HUE = (HUE + 180) % 360; // Complementary color

export const Container = styled.div`
  ${WholeContainer}
  background: linear-gradient(
    135deg,
    hsla(${HUE}, 30%, 3%, 0.95),
    hsla(${HUE}, 35%, 7%, 0.95),
    hsla(${HUE}, 30%, 2%, 0.98)
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
  width: 1px;
  background: linear-gradient(
    to bottom,
    hsla(${HUE}, 50%, 95%, 0),
    hsla(${HUE}, 50%, 95%, 0.3),
    hsla(${HUE}, 50%, 95%, 0)
  );
  height: calc(100vh - 96px);
  overflow: hidden;
`;

export const ActiveDot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 24px;
  background: hsla(${HUE}, 80%, 85%, 0.9);
  border-radius: 2px;
  top: ${({ $percentage }) => `${$percentage}%`};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 15px 0 hsla(${HUE}, 90%, 85%, 0.5),
    0 0 30px 0 hsla(${HUE}, 90%, 85%, 0.2);
`;

export const ModelList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20vh 0;
  box-sizing: border-box;
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
  width: 82%;
  margin-left: auto;
  padding: ${({ $isCurrent }) => ($isCurrent ? "2rem" : "1.5rem")};

  background: ${({ $isCurrent, $distance }) => {
    const absDistance = Math.abs($distance);
    if ($isCurrent) return `hsla(${HUE}, 40%, 12%, 0.65)`;
    if (absDistance === 1) return `hsla(${HUE}, 35%, 10%, 0.55)`;
    if (absDistance === 2) return `hsla(${HUE}, 30%, 8%, 0.45)`;
    return `hsla(${HUE}, 25%, 6%, 0.35)`;
  }};

  backdrop-filter: blur(12px);
  border: 1px solid;
  border-color: ${({ $isCurrent, $distance }) => {
    const absDistance = Math.abs($distance);
    if ($isCurrent) return `hsla(${HUE}, 60%, 95%, 0.12)`;
    return `hsla(${HUE}, 40%, 95%, 0.06)`;
  }};

  box-shadow: ${({ $isCurrent }) =>
    $isCurrent
      ? `
      0 20px 40px -8px hsla(${HUE}, 50%, 2%, 0.3),
      inset 0 1px 0 0 hsla(${HUE}, 60%, 95%, 0.08)
    `
      : `
      0 8px 24px -4px hsla(${HUE}, 40%, 2%, 0.2),
      inset 0 1px 0 0 hsla(${HUE}, 40%, 95%, 0.05)
    `};

  border-radius: 16px 0 0 16px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  height: ${({ $isCurrent }) => ($isCurrent ? "auto" : "3.5rem")};
  margin-bottom: ${({ $isCurrent }) => ($isCurrent ? "1.5rem" : "-0.5rem")};

  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    return Math.max(1 - absDistance * 0.15, 0.2);
  }};

  transform-origin: right center;
  will-change: transform, opacity;
  transform: ${({ $distance, $isCurrent }) => {
    const absDistance = Math.abs($distance);
    const scale = $isCurrent ? 1 : Math.max(0.95 - absDistance * 0.03, 0.85);
    return `translateX(${absDistance * 2}%) scale(${scale})`;
  }};

  &:hover {
    background: hsla(${HUE}, 45%, 15%, 0.75);
    border-color: hsla(${HUE}, 70%, 95%, 0.15);
    box-shadow: 0 25px 45px -10px hsla(${HUE}, 60%, 2%, 0.35),
      inset 0 1px 0 0 hsla(${HUE}, 70%, 95%, 0.1);
  }

  z-index: ${({ $distance }) => 10 - Math.min(Math.abs($distance), 3)};
`;

export const ModelName = styled.h2`
  font-size: ${({ $isCurrent }) => ($isCurrent ? "1.6rem" : "1.2rem")};
  font-weight: 400;
  letter-spacing: -0.02em;
  margin: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: ${({ $distance }) => {
    const absDistance = Math.abs($distance);
    return Math.max(1 - absDistance * 0.2, 0.4);
  }};

  background: linear-gradient(
    135deg,
    hsla(${HUE}, 90%, 95%, 1),
    hsla(${HUE}, 70%, 90%, 0.9)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const ModelDetails = styled.div`
  margin-top: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  letter-spacing: 0.01em;

  p {
    margin: 0.75rem 0;
    color: hsla(${HUE}, 20%, 95%, 0.75);
    font-weight: 300;
    transition: color 0.3s ease;

    &:hover {
      color: hsla(${HUE}, 30%, 95%, 0.9);
    }
  }
`;
