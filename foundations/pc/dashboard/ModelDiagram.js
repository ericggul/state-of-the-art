import React from "react";
import styled from "styled-components";

const DiagramContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Layer = styled.div`
  width: 100px;
  height: 30px;
  background-color: #0f3460;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #0f3460;
`;

export default function ModelDiagram({ modelName }) {
  return (
    <DiagramContainer>
      <Layer>Input</Layer>
      <Arrow />
      <Layer>Embedding</Layer>
      <Arrow />
      <Layer>Transformer</Layer>
      <Arrow />
      <Layer>Output</Layer>
    </DiagramContainer>
  );
}
