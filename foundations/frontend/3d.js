// Visualization.js
import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrientationCamera } from "./utils/OrientationCamera";
import { Box3, Vector3 } from "three";

import useScreenStore from "@/components/screen/store";
import { useModelStructure } from "@/components/frontend/utils";

import TransitionPostProcessing from "./utils/TransitionPostProcessing";
import PostProcessing from "./utils/PostProcessing";
import ModelContainer from "./components/ModelContainer";

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
  const frameRef = useRef(null);

  useEffect(() => {
    if (modelGroupRef.current && structure.length > 0) {
      // Cancel any pending frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      // Delay computation until model is ready
      frameRef.current = requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            if (!modelGroupRef.current) return;

            const box = new Box3().setFromObject(modelGroupRef.current);
            const size = new Vector3();

            // Validate box bounds before computing size
            if (
              isFinite(box.min.x) &&
              isFinite(box.max.x) &&
              isFinite(box.min.y) &&
              isFinite(box.max.y) &&
              isFinite(box.min.z) &&
              isFinite(box.max.z)
            ) {
              box.getSize(size);
              const avgDimension = Math.sqrt(
                size.x ** 2 + size.y ** 2 + size.z ** 2
              );

              if (avgDimension > 0 && isFinite(avgDimension)) {
                const distance = avgDimension * 0.23;
                setCameraDistance(distance);
                return;
              }
            }

            // Fallback if validation fails
            console.warn("Invalid model size. Using default camera distance.");
            setCameraDistance(modelName.includes("RNN") ? 70 : 400);
          } catch (e) {
            console.warn("Error computing camera distance:", e);
            setCameraDistance(modelName.includes("RNN") ? 70 : 400);
          }
        }, 500);
      });
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [structure, modelName]);

  return (
    <Canvas
      camera={{
        // fov: 90,
        fov: 70,
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
      </Suspense>
    </Canvas>
  );
}
