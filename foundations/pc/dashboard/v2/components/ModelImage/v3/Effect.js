// src/components/ImageTransitionEffect.jsx
import React, { useRef, useEffect } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { ImageTransitionMaterial } from "./materials/v2";

const ImageTransitionEffect = ({ image1, image2 }) => {
  const meshRef = useRef();
  const progress = useRef(0);
  const { viewport } = useThree();

  const [texture1, texture2] = useLoader(
    TextureLoader,
    [image1, image2],
    undefined,
    (error) => {
      console.error("Failed to load texture:", error);
      return null;
    }
  );

  // Calculate contained size
  useEffect(() => {
    if (texture1 && texture2) {
      [texture1, texture2].forEach((texture) => {
        const imgAspect = texture.image.width / texture.image.height;
        const containerAspect = viewport.width / viewport.height;

        let width, height;
        if (imgAspect > containerAspect) {
          // Image is wider - fit to width
          width = viewport.width;
          height = viewport.width / imgAspect;
        } else {
          // Image is taller - fit to height
          height = viewport.height;
          width = viewport.height * imgAspect;
        }

        if (meshRef.current) {
          meshRef.current.scale.set(width, height, 1);
        }
      });
    }
  }, [texture1, texture2, viewport]);

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
      <planeGeometry args={[1, 1]} />
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
