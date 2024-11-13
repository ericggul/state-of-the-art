import React from "react";
import styled from "styled-components";
import TypewriterText from "./TypewriterText";
import { DEFAULT_MODEL } from "../utils/constants";

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeatureSection = styled.div`
  margin-bottom: 2vw;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  color: #00ffff;
  font-size: 0.9vw;
  margin-bottom: 1vw;
  text-shadow: 0 0 10px #00ffff;
  opacity: 0.8;
`;

const FeatureItem = styled.li`
  margin-bottom: 1vw;
  color: #00ffff;
  font-size: 0.9vw;
  opacity: 0.8;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Bullet = styled.span`
  color: ${(props) => (props.$isHighlight ? "#00ff00" : "#ff0000")};
  text-shadow: 0 0 5px
    ${(props) => (props.$isHighlight ? "#00ff00" : "#ff0000")};
  margin-right: 0.5vw;
`;

export default function ModelFeatures({ model }) {
  const currentModel = model || DEFAULT_MODEL;
  const highlights = currentModel.highlights || [];
  const limitations = currentModel.limitations || [];

  return (
    <>
      <FeatureSection>
        <SectionTitle>Model Highlights</SectionTitle>
        <FeatureList>
          {highlights.map((highlight, index) => (
            <FeatureItem key={index}>
              <Bullet $isHighlight>+</Bullet>
              <TypewriterText text={highlight} speed={20} />
            </FeatureItem>
          ))}
        </FeatureList>
      </FeatureSection>

      <FeatureSection>
        <SectionTitle>Model Limitations</SectionTitle>
        <FeatureList>
          {limitations.map((limitation, index) => (
            <FeatureItem key={index}>
              <Bullet $isHighlight={false}>-</Bullet>
              <TypewriterText text={limitation} speed={20} />
            </FeatureItem>
          ))}
        </FeatureList>
      </FeatureSection>
    </>
  );
}
