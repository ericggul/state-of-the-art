// Visualization.js
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useMemo, useEffect, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Import styles and structures
import { STYLE_STRATEGIES } from "./style";
import { VIDEO_GEN_STRUCTURE, ALEXNET_STRUCTURE } from "./structure";

import AlexNetLayers from "./layers/AlexNetLayers";
import VideoGenLayers from "./layers/VideoGenLayers";

export default function Visualization({ model = "alexNet", styleIndex = 3 }) {
  const style = STYLE_STRATEGIES[styleIndex];

  return (
    <Canvas camera={style.camera}>
      <CommonScene style={style}>
        {model === "alexNet" ? (
          <AlexNetLayers structure={ALEXNET_STRUCTURE} style={style} />
        ) : (
          <VideoGenLayers structure={VIDEO_GEN_STRUCTURE} style={style} />
        )}
      </CommonScene>
    </Canvas>
  );
}

function CommonScene({ style, children }) {
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
      {children}
      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
      <EffectComposer>
        {style.postprocessing && style.postprocessing.bloom && (
          <Bloom {...style.postprocessing.bloom} />
        )}
      </EffectComposer>
    </>
  );
}
