// Visualization.js
import React, { useState, useEffect } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import useScreenStore from "@/components/screen/store";
import { STYLE_STRATEGIES } from "@/foundations/frontend/style";

const HAL_9000_LIGHT = {
  position: [0, 0, 0], // Center of the scene
  color: 0xff0000, // Bright red
  intensity: 200, // Strong intensity
  distance: 10000, // Adjust based on your scene size
  decay: 1.5, // Quadratic light falloff
};

export default function CommonScene({ children }) {
  const styleIndex = useScreenStore((state) => state.styleIndex);
  const style = STYLE_STRATEGIES[styleIndex];

  return (
    <>
      <Suspense fallback={null}>
        <Environment
          preset={style.lighting.environment || "warehouse"}
          intensity={style.lighting.envIntensity || 1}
        />
      </Suspense>
      {style.lighting.pointLight && (
        <pointLight {...style.lighting.pointLight} />
      )}
      {style.lighting.directionalLight && (
        <directionalLight {...style.lighting.directionalLight} />
      )}
      {style.lighting.directionalLight1 && (
        <directionalLight {...style.lighting.directionalLight1} />
      )}
      {style.lighting.directionalLight2 && (
        <directionalLight {...style.lighting.directionalLight2} />
      )}
      {style.lighting.ambientLight && (
        <ambientLight {...style.lighting.ambientLight} />
      )}
      <pointLight {...HAL_9000_LIGHT} />
      {children}
      <OrbitControls enablePan={true} />
      <EffectComposer>
        {style.postprocessing && style.postprocessing.bloom && (
          <Bloom {...style.postprocessing.bloom} />
        )}
      </EffectComposer>
    </>
  );
}
