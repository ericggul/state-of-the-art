// src/components/ImageTransitionEffect.jsx
import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { ImageTransitionMaterial } from "./Material";

const ImageTransitionEffect = ({ image1, image2 }) => {
  const meshRef = useRef();
  const [texture1, texture2] = useLoader(TextureLoader, [image1, image2]);

  const progress = useRef(0);
  const direction = useRef(1);

  useFrame(() => {
    if (meshRef.current) {
      progress.current += 0.01 * direction.current;
      if (progress.current >= 1 || progress.current <= 0) {
        direction.current *= -1;
      }

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
