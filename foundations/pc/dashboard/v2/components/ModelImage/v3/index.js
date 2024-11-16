// src/components/ModelImage.jsx
import React from "react";
import styled from "styled-components";
import TypewriterText from "@/foundations/pc/dashboard/v2/components/TypewriterText";
import ShaderScene from "./ShaderScene";

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid rgba(0, 170, 255, 0.2);
  margin-bottom: 1vw;
`;

const Description = styled.p`
  font-size: 0.9vw;
  line-height: 1.5;
  color: #ffffff;
`;

const IMAGE_BASE = "/db/images/";

export default function ModelImage({ model }) {
  const defaultImage = IMAGE_BASE + "1.png";
  const modelImage = IMAGE_BASE + (model.image || "1.png");

  return (
    <ImageContainer>
      <ImageWrapper>
        <ShaderScene image1={defaultImage} image2={modelImage} />
      </ImageWrapper>
      <Description>
        <TypewriterText text={model.explanation} speed={20} />
      </Description>
    </ImageContainer>
  );
}
