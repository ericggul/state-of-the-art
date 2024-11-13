import React from "react";
import styled from "styled-components";
import useStore from "@/components/screen/store";
import { DEFAULT_MODEL } from "../utils/constants";

const DiagramContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vw;
`;

const Layer = styled.div`
  width: 10vw;
  height: 3vw;
  background-color: rgba(0, 128, 255, 0.2);
  color: #00ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #00ffff;
  font-size: 0.9vw;
  text-shadow: 0 0 5px #00ffff;
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 1vw solid transparent;
  border-right: 1vw solid transparent;
  border-top: 1vw solid #00ffff;
`;

export default function ModelDiagram({ model }) {
  const architecture = model?.architecture || DEFAULT_MODEL.architecture || [];

  console.log(architecture);

  return (
    <DiagramContainer>
      {architecture.map((layer, index) => (
        <React.Fragment key={layer}>
          <Layer>{layer}</Layer>
          {index < architecture.length - 1 && <Arrow />}
        </React.Fragment>
      ))}
    </DiagramContainer>
  );
}
