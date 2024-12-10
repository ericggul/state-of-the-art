import React from "react";
import styled from "styled-components";

const LoadingContainer = styled.div`
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  z-index: 100;
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
    border: 2px solid hsla(${props.$hue}, 10%, 50%, 0.1);
    border-top: 2px solid hsla(${props.$hue}, 10%, 75%, 0.8);
  `
      : `
    width: 70%;
    height: 70%;
    top: 15%;
    left: 15%;
    border: 2px solid hsla(${props.$hue}, 10%, 50%, 0.1);
    border-bottom: 2px solid hsla(${props.$hue}, 10%, 65%, 0.6);
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

const LoadingText = styled.p`
  position: absolute;
  top: 80px;
  width: 100px;
  font-size: 0.8rem;
  color: hsla(0, 0%, 100%, 0.8);
  text-shadow: 0 0 5px hsla(0, 0%, 0%, 0.5);
  text-align: center;
`;

export default function ScrollLoading() {
  return (
    <LoadingContainer>
      <Ring $outer $hue={0} />
      <Ring $reverse $hue={0} />
      <LoadingText>Loading More Models...</LoadingText>
    </LoadingContainer>
  );
}
