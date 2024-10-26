// Visualization.js
import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrientationCamera } from "./utils/OrientationCamera";
import { Box3, Vector3 } from "three";

// Import styles and structures
import { STYLE_STRATEGIES } from "./style";
import { LAYER_CONFIGS, getModelStructure } from "./arch-models/_structure";
import { OBJECT_ARRAY } from "@/components/controller/constant/models/v2";

import BasicNNLayers from "./arch/layers/BasicNNLayers";
import CNNLayers from "./arch/layers/CNNLayers";
import TransformerLayers from "./arch/layers/TransformerLayers";
import RNNLayers from "./arch/layers/RNNLayers";
import VAELayers from "./arch/layers/VAELayers";
import SelfSupervisedLayers from "./arch/layers/SelfSupervisedLayers";
import GANLayers from "./arch/layers/GANLayers";
import DiffusionLayers from "./arch/layers/DiffusionLayers";
import MultiModalLayers from "./arch/layers/MultiModalLayers";
import ReinforcementLayers from "./arch/layers/ReinforcementLayers";

import AvatarModel from "@/foundations/frontend/avatar/model";
import CommonScene from "./utils/CommonScene";
import PostProcessing from "./utils/PostProcessing";
import PositionalAudio from "./utils/PositionalAudio";

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
  styleIndex = 0,
}) {
  const [modelName, setModelName] = useState("");
  const [structure, setStructure] = useState([]);
  const style = STYLE_STRATEGIES[styleIndex];
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
      // Delay the calculation to ensure the 3D objects are rendered
      setTimeout(() => {
        const box = new Box3().setFromObject(modelGroupRef.current);
        const size = new Vector3();
        box.getSize(size);
        // console.log("size", size);

        // Use the maximum dimension
        const maxDimension = Math.max(size.x, size.y, size.z);
        const avgDimension = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2);

        if (avgDimension === 0 || !isFinite(avgDimension)) {
          console.warn("Invalid model size. Using default camera distance.");
          setCameraDistance(400); // Default distance
        } else {
          const distance = avgDimension * 0.23;
          // console.log(
          //   `Calculated camera distance for ${modelName}: `,
          //   distance
          // );
          setCameraDistance(distance);
        }
      }, 500); // Adjust this delay if needed
    }
  }, [structure, modelName]);

  const modelConfig = LAYER_CONFIGS[modelName];

  let ModelComponent;
  if (modelConfig) {
    switch (modelConfig.type) {
      case "basic_nn":
        ModelComponent = BasicNNLayers;
        break;
      case "cnn":
        ModelComponent = CNNLayers;
        break;
      case "transformer":
        ModelComponent = TransformerLayers;
        break;
      case "rnn":
        ModelComponent = RNNLayers;
        break;
      case "vae":
        ModelComponent = VAELayers;
        break;
      case "self_supervised":
        ModelComponent = SelfSupervisedLayers;
        break;
      case "gan":
        ModelComponent = GANLayers;
        break;
      case "diffusion":
        ModelComponent = DiffusionLayers;
        break;
      case "multi_modal":
        ModelComponent = MultiModalLayers;
        break;
      case "reinforcement":
        ModelComponent = ReinforcementLayers;
        break;

      default:
        console.warn(
          `Unknown model type: ${modelConfig.type}. Defaulting to BasicNNLayers.`
        );
        ModelComponent = BasicNNLayers;
    }
  } else {
    console.warn(
      `No configuration found for model: ${modelName}. Defaulting to BasicNNLayers.`
    );
    ModelComponent = BasicNNLayers;
  }

  // console.log(structure);

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
          <group ref={modelGroupRef}>
            {structure.length > 0 && (
              <ModelComponent
                structure={structure}
                style={style}
                model={modelName}
              />
            )}
          </group>
          <AvatarModel />
          {!isTesting && <OrientationCamera cameraDistance={cameraDistance} />}
          <PostProcessing />
          <PositionalAudio distance={cameraDistance * 0.2} />
        </CommonScene>
      </Suspense>
    </Canvas>
  );
}
