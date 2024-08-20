// index.js
"use client";

import { useMemo, useState, Suspense } from "react";
import * as S from "./styles";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import DeviceOrientationControls from "@/foundations/test/yakitori/0/utils/device-orientation-controls";

import { Perf } from "r3f-perf";

import SingleLayer from "./layer";

const INTERVAL = 25;
const Y_LEN = 11;

// Main component to render the neural network
export default function Yakitori({ layerIdx = 4, layersExpanded = [true, true, true, true, true], enableDeviceControls = true }) {
  const focalZPos = useMemo(() => 0, []);

  return (
    <S.Container>
      <Canvas
        camera={{
          position: [-60, 0, focalZPos],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <CameraLookAt focalZPos={focalZPos} />
        <Perf position="top-left" />

        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 10, 10]} intensity={1} />
        <directionalLight position={[10, 0, 10]} intensity={1} />

        {new Array(Y_LEN).fill(0).map((_, y) => (
          <SingleLayer
            key={`${y}}`}
            position={[
              INTERVAL * (y - (Y_LEN - 1) / 2), // Y-axis position
              0,
              0, // X-axis remains the same
            ]}
            yIdx={y}
            layerIdx={layerIdx}
          />
        ))}

        <OrbitControls autoRotate />
        {enableDeviceControls && <DeviceOrientationControls layerIdx={layerIdx} />}
        <Stars radius={80} depth={50} count={5000} factor={4} saturation={0} fade={true} />
      </Canvas>
    </S.Container>
  );
}

function CameraLookAt({ focalZPos }) {
  useFrame((state) => {
    state.camera.lookAt(0, 0, focalZPos);
  });

  return null;
}
