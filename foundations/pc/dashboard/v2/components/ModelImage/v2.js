import React, { useState, useEffect } from "react";
import { Surface } from "gl-react-dom";
import { Node, Shaders, GLSL } from "gl-react";
import styled from "styled-components";
import TypewriterText from "../TypewriterText";
import { TIFFANY_BLUE } from "../../utils/constants";

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

const FallbackImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const NeonOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
`;

// Adjusted shader as explained above
const shaders = Shaders.create({
  transition: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D image;
      uniform vec3 tiffanyColor;
      
      void main() {
        vec4 color = texture2D(image, uv);
        
        // Convert to grayscale
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        
        // Threshold for neon effect
        float threshold = 0.6;
        vec3 finalColor = gray > threshold ? tiffanyColor : vec3(0.0);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  },
});

// Helper function to convert hex to RGB
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

const IMAGE_BASE = "/images";

export default function ModelImage({ model }) {
  // Convert TIFFANY_BLUE to RGB vector for shader
  const tiffanyRGB = hexToRgb(TIFFANY_BLUE);
  const tiffanyVector = [
    tiffanyRGB.r / 255,
    tiffanyRGB.g / 255,
    tiffanyRGB.b / 255,
  ];

  return (
    <ImageContainer>
      <ImageWrapper>
        <Surface width={300} height={200}>
          <Node
            shader={shaders.transition}
            uniforms={{
              image: `${IMAGE_BASE}/${model.image || "g1.png"}`,
              tiffanyColor: tiffanyVector,
            }}
          />
        </Surface>
        <NeonOverlay />
      </ImageWrapper>
      <Description>
        <TypewriterText text={model.explanation} speed={20} />
      </Description>
    </ImageContainer>
  );
}

// Helper function to load images
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error("Failed to load image:", src);
      reject(new Error("Failed to load image"));
    };
  });
}
