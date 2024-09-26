// index.js
"use client";

import { useMemo, useState, Suspense } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import DeviceOrientationControls from "@/foundations/test-frontend/yakitori/0/utils/device-orientation-controls";

import { Perf } from "r3f-perf";

import SingleLayer from "./layer";
import { generateStructure } from "./layer/structure";

const INTERVAL = 25;

export const X_LEN = 10;
const Y_LEN = 3;

// Main component to render the neural network
export default function Yakitori({ enableDeviceControls = true }) {
  const structure = useMemo(() => generateStructure(X_LEN), []); // Generate the structure dynamically

  return (
    <Canvas
      camera={{
        position: [120, 60, 80],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
    >
      <CameraLookAt structure={structure} />
      <Perf position="top-left" />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[0, 10, 10]} intensity={2} />
      <directionalLight position={[10, 0, 10]} intensity={2} />
      {new Array(Y_LEN).fill(0).map((_, y) =>
        new Array(Y_LEN).fill(0).map((_, z) => (
          <SingleLayer
            key={`${y}-${z}`}
            position={[
              INTERVAL * (y - (Y_LEN - 1) / 2), // Y-axis position
              INTERVAL * (z - (Y_LEN - 1) / 2), // Z-axis position
              0, // X-axis remains the same
            ]}
            yIdx={y}
            zIdx={z}
          />
        ))
      )}

      <OrbitControls />
      {enableDeviceControls && <DeviceOrientationControls />}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade={true} />
    </Canvas>
  );
}

function CameraLookAt({ structure }) {
  useFrame((state) => {
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
