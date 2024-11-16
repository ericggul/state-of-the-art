// src/components/ShaderScene.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import ImageTransitionEffect from "./Effect";

const ShaderScene = ({ image1, image2 }) => {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 5] }}
    >
      <ImageTransitionEffect image1={image1} image2={image2} />
    </Canvas>
  );
};

export default ShaderScene;
