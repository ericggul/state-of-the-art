import React from "react";
import styled from "styled-components";
import TypewriterText from "./TypewriterText";
import { DEFAULT_MODEL } from "./constants";

const LimitationList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const LimitationItem = styled.li`
  margin-bottom: 1vw;
  color: #00ffff;
  font-size: 0.9vw;
  opacity: 0.8;
`;

export default function ModelLimitations({ model }) {
  const limitations = model?.limitations || DEFAULT_MODEL.limitations || [];

  return (
    <LimitationList>
      {limitations.map((limitation, index) => (
        <LimitationItem key={index}>
          • <TypewriterText text={limitation} speed={20} />
        </LimitationItem>
      ))}
    </LimitationList>
  );
}
