// Visualization.js
import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrientationCamera } from "./utils/OrientationCamera";
import { Box3, Vector3 } from "three";
import { Perf } from "r3f-perf";

import useScreenStore from "@/components/screen/store";
import { useModelStructure } from "@/components/frontend/utils";

import TransitionPostProcessing from "./utils/TransitionPostProcessing";
import PostProcessing from "./utils/PostProcessing";
import ModelContainer from "./components/ModelContainer";
import PositionalAudio from "./utils/PositionalAudio";

const INITIAL_CAMERA_DISTANCE = 10000;

export default function Visualisation({ isTesting = false }) {
  const currentArchitectures = useScreenStore(
    (state) => state.currentArchitectures
  );
  const isProjector = useScreenStore((state) => state.isProjector);
  const {
    visualization: { modelName, structure, isLoading },
    setIsLoading,
  } = useModelStructure(currentArchitectures);

  const modelGroupRef = useRef();
  const [cameraDistance, setCameraDistance] = useState(INITIAL_CAMERA_DISTANCE);

  console.log(modelName, currentArchitectures);

  useEffect(() => {
    if (modelGroupRef.current && structure.length > 0) {
      setTimeout(() => {
        try {
          const box = new Box3().setFromObject(modelGroupRef.current);
          const size = new Vector3();
          box.getSize(size);

          const avgDimension = Math.sqrt(
            size.x ** 2 + size.y ** 2 + size.z ** 2
          );

          if (avgDimension === 0 || !isFinite(avgDimension)) {
            console.warn("Invalid model size. Using default camera distance.");
            //if type is rnn, use a smaller distance
            if (modelName.includes("RNN")) {
              setCameraDistance(70);
            } else {
              setCameraDistance(400);
            }
          } else {
            const distance = avgDimension * 0.23;
            setCameraDistance(distance);
          }
        } catch (e) {
          console.log(e);
        }
      }, 500);
    }
  }, [structure, modelName]);

  return (
    <Canvas
      camera={{
        fov: 90,
        near: 0.1,
        far: 500000,
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <Suspense fallback={null}>
        <ModelContainer
          modelName={modelName}
          structure={structure}
          modelGroupRef={modelGroupRef}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <OrientationCamera cameraDistance={cameraDistance} />
        {!isProjector && <PostProcessing />}
        <TransitionPostProcessing />
        <Perf />
        {/* <PositionalAudio distance={200} /> */}
      </Suspense>
    </Canvas>
  );
}
