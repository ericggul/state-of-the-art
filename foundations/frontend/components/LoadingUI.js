import React from "react";
import { Html } from "@react-three/drei";
import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";
import styled from "styled-components";

const LoadingContainer = styled.div`
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  position: absolute;
`;

const Ring = styled.div`
  position: absolute;
  border-radius: 50%;
  left: 0;
  top: 0;
  animation: ${(props) =>
    props.$reverse
      ? "spin 1.5s linear infinite reverse"
      : "spin 1s linear infinite"};

  ${(props) =>
    props.$outer
      ? `
    width: 100%;
    height: 100%;
    border: 2px solid hsla(${props.$hue}, 70%, 50%, 0.1);
    border-top: 2px solid hsla(${props.$hue}, 70%, 75%, 0.8);
  `
      : `
    width: 70%;
    height: 70%;
    top: 15%;
    left: 15%;
    border: 2px solid hsla(${props.$hue}, 70%, 50%, 0.1);
    border-bottom: 2px solid hsla(${props.$hue}, 70%, 65%, 0.6);
  `}

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ArchitectureText = styled.p`
  position: absolute;
  font-size: 0.8vw;
  font-weight: 400;
  letter-spacing: 0.05em;
  white-space: nowrap;
  transform: translateZ(0);
  transition: color 0.3s ease, text-shadow 0.3s ease;

  ${(props) =>
    props.$isCategory
      ? `
    top: -2.5rem;
    color: hsla(${props.$hue + 30}, 70%, 85%, 0.5);
    text-shadow: 0 0 15px hsla(${props.$hue + 30}, 70%, 50%, 0.15);
    text-transform: uppercase;
    font-size: 0.5vw;
  `
      : `
    top: 100%;
    margin-top: 1.5rem;
    color: hsla(${props.$hue}, 70%, 85%, 0.6);
    text-shadow: 0 0 15px hsla(${props.$hue}, 70%, 50%, 0.2);
    text-transform: uppercase;
    font-size: 0.5vw;
    font-style: italic;
  `}
`;

export default function LoadingUI() {
  const currentArchitectures = useScreenStore(
    (state) => state.currentArchitectures
  );
  const targetHue = currentArchitectures?.[0]?.hue ?? 230;
  const debouncedHue = useDebounce(targetHue, 100);
  const architectureName = currentArchitectures?.[0]?.name;

  return (
    <Html center>
      <LoadingContainer>
        <Ring $outer $hue={targetHue} />
        <Ring $reverse $hue={targetHue} />
        {architectureName && (
          <ArchitectureText $hue={targetHue}>
            {architectureName}
          </ArchitectureText>
        )}
      </LoadingContainer>
    </Html>
  );
}
