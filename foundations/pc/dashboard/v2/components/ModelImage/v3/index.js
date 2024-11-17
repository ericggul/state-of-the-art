// src/components/ModelImage.jsx
import React, { useEffect, useState, useRef, Suspense } from "react";
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
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(model?.image || "1.png");
  const [prevImage, setPrevImage] = useState(model?.image || "1.png");
  const isFirstRender = useRef(true);

  // Check if image exists before trying to load it
  const checkImage = async (imagePath) => {
    try {
      const response = await fetch(IMAGE_BASE + imagePath);
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!model?.image) {
      setImageError(true);
      return;
    }

    const validateImage = async () => {
      const exists = await checkImage(model.image);
      if (!exists) {
        setImageError(true);
      } else {
        setImageError(false);
        if (!isFirstRender.current) {
          setPrevImage(currentImage);
        }
        setCurrentImage(model.image);
      }
      isFirstRender.current = false;
    };

    validateImage();
  }, [model?.image]);

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
          <TypewriterText
            text={model?.explanation || "Description not available"}
            speed={20}
          />
        </Description>
      </ImageContainer>
    );
  }

  return (
    <Suspense fallback={null}>
      <ImageContainer>
        <ImageWrapper>
          <ShaderScene
            image1={IMAGE_BASE + prevImage}
            image2={IMAGE_BASE + currentImage}
            onError={() => setImageError(true)}
          />
        </ImageWrapper>
        <Description>
          <TypewriterText
            text={model?.explanation || "Description not available"}
            speed={20}
          />
        </Description>
      </ImageContainer>
    </Suspense>
  );
}
