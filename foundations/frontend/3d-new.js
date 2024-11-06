// Visualization.js
import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrientationCamera } from "./utils/OrientationCamera";
import { Box3, Vector3 } from "three";
import { Perf } from "r3f-perf";

import useScreenStore from "@/components/screen/store";

import { STYLE_STRATEGIES } from "./style";
import { getModelStructure } from "./arch-models/_structure";
import { OBJECT_ARRAY } from "@/components/controller/constant/models/v3";

import CommonScene from "./utils/CommonScene";
import PostProcessing from "./utils/PostProcessing";

import ModelContainer from "./components/ModelContainer-new";

const CURRENT_TESTING_VERSION = "v4.0.3";
// Utility function to convert model name to variable name
function convertToVariableName(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, ""); // Remove leading and trailing underscores
}

// Utility function to map version to model name
function getModelNameFromVersion(version) {
  const model = OBJECT_ARRAY.find((item) => item.version === version);
  return model ? convertToVariableName(model.name) : null;
}

//styleidx
//0: subtle red
//1: judd red
//2: seagram green
//3: subtle green
//4: subtle blue

const INITIAL_CAMERA_DISTANCE = 10000;

export default function Visualisation({
  version = CURRENT_TESTING_VERSION,
  isTesting,
}) {
  const { styleIndex } = useScreenStore();
  const style = STYLE_STRATEGIES[styleIndex];
  const modelGroupRef = useRef();

  // Memoize these values to prevent unnecessary recalculations
  const [modelData, setModelData] = useState({
    name: "",
    structure: [],
    cameraDistance: INITIAL_CAMERA_DISTANCE,
  });

  // Ref to track when the model has actually changed
  const modelChangedRef = useRef(false);

  // Function to handle model change
  const handleModelChange = () => {
    modelChangedRef.current = true;

    // Recalculate camera distance
    if (modelGroupRef.current) {
      const calculateCameraDistance = () => {
        const box = new Box3().setFromObject(modelGroupRef.current);
        const size = new Vector3();
        box.getSize(size);

        const avgDimension = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2);
        return avgDimension === 0 || !isFinite(avgDimension)
          ? 400
          : avgDimension * 0.23;
      };

      setModelData((prev) => ({
        ...prev,
        cameraDistance: calculateCameraDistance(),
      }));
    }
  };

  // Effect for model initialization
  useEffect(() => {
    const name = getModelNameFromVersion(version);
    if (name) {
      const modelStructure = getModelStructure(name) || [];
      setModelData((prev) => ({
        ...prev,
        name,
        structure: modelStructure,
      }));
      // Reset the modelChanged flag
      modelChangedRef.current = false;
    }
  }, [version]);

  return (
    <Canvas
      camera={{
        fov: 75,
        near: 0.1,
        far: 500000,
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <Suspense fallback={null}>
        <CommonScene style={style}>
          <ModelContainer
            modelName={modelData.name}
            structure={modelData.structure}
            style={style}
            modelGroupRef={modelGroupRef}
            onModelChange={handleModelChange}
          />
          {!isTesting && (
            <OrientationCamera cameraDistance={modelData.cameraDistance} />
          )}
          <PostProcessing />
        </CommonScene>
      </Suspense>
    </Canvas>
  );
}
