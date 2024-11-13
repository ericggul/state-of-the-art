import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import TypewriterText from "./TypewriterText";
import { TIFFANY_BLUE } from "../utils/constants";

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1vw;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Description = styled.p`
  font-size: 0.9vw;
  line-height: 1.5;
  color: #ffffff;
`;

const IMAGE_BASE = "/db/images/";
const BLACK = "#000000";
const NEON = TIFFANY_BLUE;

const processImageData = (ctx, imageData) => {
  const data = imageData.data;
  const rgb = hexToRgb(TIFFANY_BLUE);

  for (let i = 0; i < data.length; i += 4) {
    // Get brightness from original pixel
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

    // Invert the threshold condition
    if (brightness > 128) {
      // Make brighter pixels black
      data[i] = 0; // BLACK
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 255; // Full opacity
    } else {
      // Make darker pixels NEON
      data[i] = rgb.r; // NEON color
      data[i + 1] = rgb.g;
      data[i + 2] = rgb.b;
      data[i + 3] = 255; // Full opacity
    }
  }

  return imageData;
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export default function ModelImage({ model }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();

    image.crossOrigin = "Anonymous";
    image.src = IMAGE_BASE + (model.image || "g1.png");

    image.onload = () => {
      // Set canvas size to match image dimensions while maintaining aspect ratio
      const aspectRatio = image.width / image.height;
      const canvasHeight = canvas.offsetHeight;
      const canvasWidth = canvasHeight * aspectRatio;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill background with black first
      ctx.fillStyle = BLACK;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw original image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Process image data
      const processedImageData = processImageData(ctx, imageData);

      // Clear canvas and draw processed image
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill with black again
      ctx.fillStyle = BLACK;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.putImageData(processedImageData, 0, 0);

      // No glow effect, no artistic effect, no alpha changes
    };

    image.onerror = () => {
      image.src = IMAGE_BASE + "g1.png";
    };

    // Cleanup
    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [model.image]);

  return (
    <ImageContainer>
      <ImageWrapper>
        <Canvas ref={canvasRef} />
      </ImageWrapper>
      <Description>
        <TypewriterText text={model.explanation} speed={20} />
      </Description>
    </ImageContainer>
  );
}
