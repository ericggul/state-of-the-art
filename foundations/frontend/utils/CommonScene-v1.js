// Visualization.js
import React from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const HAL_9000_LIGHT = {
  position: [0, 0, 0], // Center of the scene
  color: 0xff0000, // Bright red
  intensity: 1000, // Strong intensity
  distance: 10000, // Adjust based on your scene size
  decay: 1.0, // longer decay?
  power: 2000,
};

export default function CommonScene({ children, style }) {
  return (
    <>
      <Suspense fallback={null}>
        <Environment
          files={`/3d/environment/${
            style.lighting.environment || "apartment"
          }.hdr`}
          intensity={style.lighting.envIntensity || 0.1}
          blurriness={style.lighting.envMapBlurriness || 0.5}
        />
      </Suspense>
      <ambientLight intensity={2} />
      {style.lighting.pointLight && (
        <pointLight {...style.lighting.pointLight} />
      )}
      {style.lighting.pointLight2 && (
        <pointLight {...style.lighting.pointLight2} />
      )}
      {style.lighting.pointLight3 && (
        <pointLight {...style.lighting.pointLight3} />
      )}
      {style.lighting.pointLight4 && (
        <pointLight {...style.lighting.pointLight4} />
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
