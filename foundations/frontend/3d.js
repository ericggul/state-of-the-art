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

import ModelContainer from "./components/ModelContainer";

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

  const [modelName, setModelName] = useState("");
  const [structure, setStructure] = useState([]);
  const modelGroupRef = useRef();
  const [cameraDistance, setCameraDistance] = useState(INITIAL_CAMERA_DISTANCE);

  useEffect(() => {
    const name = getModelNameFromVersion(version);
    if (name) {
      setModelName(name);
      const modelStructure = getModelStructure(name);
      setStructure(modelStructure);
    } else {
      console.warn(`No model found for version: ${version}`);
    }
  }, [version]);

  useEffect(() => {
    if (modelGroupRef.current && structure.length > 0) {
      setTimeout(() => {
        const box = new Box3().setFromObject(modelGroupRef.current);
        const size = new Vector3();
        box.getSize(size);

        const avgDimension = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2);

        if (avgDimension === 0 || !isFinite(avgDimension)) {
          console.warn("Invalid model size. Using default camera distance.");
          setCameraDistance(400);
        } else {
          const distance = avgDimension * 0.23;
          setCameraDistance(distance);
        }
      }, 500);
    }
  }, [structure, modelName]);

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
            modelName={modelName}
            structure={structure}
            style={style}
            modelGroupRef={modelGroupRef}
          />
          {!isTesting && <OrientationCamera cameraDistance={cameraDistance} />}
          <PostProcessing />
        </CommonScene>
      </Suspense>
    </Canvas>
  );
}
