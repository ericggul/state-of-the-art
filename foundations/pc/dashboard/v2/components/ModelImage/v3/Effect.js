// src/components/ImageTransitionEffect.jsx
import React, { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { ImageTransitionMaterial } from "./Material";

const ImageTransitionEffect = ({ image1, image2 }) => {
  const meshRef = useRef();
  const progress = useRef(0);

  // Simple error handling with try/catch in loader
  const [texture1, texture2] = useLoader(
    TextureLoader,
    [image1, image2],
    undefined,
    (error) => {
      console.error("Failed to load texture:", error);
      return null;
    }
  );

  // Reset progress when images change
  useEffect(() => {
    progress.current = 0;
  }, [image1, image2]);

  useFrame(() => {
    if (meshRef.current && progress.current < 1) {
      progress.current = Math.min(progress.current + 0.02, 1);
      meshRef.current.material.uniforms.uProgress.value = progress.current;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 3]} />
      <shaderMaterial
        attach="material"
        args={[ImageTransitionMaterial]}
        uniforms-uTexture1-value={texture1}
        uniforms-uTexture2-value={texture2}
      />
    </mesh>
  );
};

export default ImageTransitionEffect;
