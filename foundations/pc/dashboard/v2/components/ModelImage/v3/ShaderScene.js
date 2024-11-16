// src/components/ShaderScene.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ImageTransitionEffect from "./Effect";

// Simple fallback for loading/error states
const FallbackContent = () => (
  <mesh>
    <planeGeometry args={[5, 3]} />
    <meshBasicMaterial color="#1a1a1a" />
  </mesh>
);

const ShaderScene = ({ image1, image2 }) => {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{
        position: [0, 0, 1.5],
        fov: 45,
      }}
      orthographic
    >
      <Suspense fallback={<FallbackContent />}>
        <ImageTransitionEffect image1={image1} image2={image2} />
      </Suspense>
    </Canvas>
  );
};

export default ShaderScene;
