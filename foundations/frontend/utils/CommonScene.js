"use client";

import React, { useState, useEffect, Suspense } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ErrorBoundary } from "react-error-boundary";

const HAL_9000_LIGHT = {
  position: [0, 0, 0],
  color: 0xff0000,
  intensity: 1000,
  distance: 10000,
  decay: 1.0,
  power: 2000,
};

// Separate Environment component with its own error handling
function EnvironmentWithFallback({ style }) {
  const [envFailed, setEnvFailed] = useState(false);

  useEffect(() => {
    setEnvFailed(false);
  }, [style]);

  if (envFailed) return null;

  return (
    <ErrorBoundary
      fallback={null}
      onError={(error) => {
        console.warn("Environment failed to load:", error);
        setEnvFailed(true);
      }}
    >
      <Suspense fallback={null}>
        <Environment
          files={`/3d/environment/${
            style.lighting.environment || "apartment"
          }.hdr`}
          intensity={style.lighting.envIntensity || 0.1}
          blurriness={style.lighting.envMapBlurriness || 0.5}
          onError={(error) => {
            console.warn(
              "Environment load error: skipping environment.",
              error
            );
            setEnvFailed(true);
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export default function CommonScene({ children, style }) {
  return (
    <>
      <EnvironmentWithFallback style={style} />

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
        {style.postprocessing?.bloom && (
          <Bloom {...style.postprocessing.bloom} />
        )}
      </EffectComposer>
    </>
  );
}
