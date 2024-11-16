// src/components/ModelImage.jsx
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import TypewriterText from "@/foundations/pc/dashboard/v2/components/TypewriterText";
import ShaderScene from "./ShaderScene";
import useDebounce from "@/utils/hooks/useDebounce";

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
  const [imageError, setImageError] = React.useState(false);
  const [currentModelImage, setCurrentModelImage] = useState(
    model?.image || "1.png"
  );
  const [prevModelImage, setPrevModelImage] = useState(model?.image || "1.png");
  const isFirstRender = useRef(true);

  // Debounce the model image changes
  const debouncedModelImage = useDebounce(model?.image, 100); // 100ms delay

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debouncedModelImage !== currentModelImage) {
      setPrevModelImage(currentModelImage);
      setCurrentModelImage(debouncedModelImage || "1.png");
    }
  }, [debouncedModelImage]);

  const prevImage = IMAGE_BASE + prevModelImage;
  const currentImage = IMAGE_BASE + currentModelImage;

  if (imageError) {
    return (
      <ImageContainer>
        <ImageWrapper
          style={{
            background: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#666" }}>Image not available</span>
        </ImageWrapper>
        <Description>
          <TypewriterText text={model.explanation} speed={20} />
        </Description>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer>
      <ImageWrapper>
        <ShaderScene
          image1={prevImage}
          image2={currentImage}
          onError={() => setImageError(true)}
        />
      </ImageWrapper>
      <Description>
        <TypewriterText text={model.explanation} speed={20} />
      </Description>
    </ImageContainer>
  );
}
