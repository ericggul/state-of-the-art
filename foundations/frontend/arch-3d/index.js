// Visualization.js
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Import styles and structures
import { STYLE_STRATEGIES } from "./style";
import { LAYER_CONFIGS, getModelStructure } from "./structure";
import { OBJECT_ARRAY } from "@/components/controller/constant/models/v2";

import BasicNNLayers from "./components/layers/BasicNNLayers";
import CNNLayers from "./components/layers/CNNLayers";
import TransformerLayers from "./components/layers/TransformerLayers";
import RNNLayers from "./components/layers/RNNLayers";
import VAELayers from "./components/layers/VAELayers";
import SelfSupervisedLayers from "./components/layers/SelfSupervisedLayers";

//current target versions
//mcculloch v1.0
//perceptron v1.1
//multi layer v1.2

//lenet v3.1.1
//lenet5 v3.1.2
//alexnet v3.2.1
//vgg v3.2.2
//transformer v4.2
//gpt v4.2.3.1

const CURRENT_TESTING_VERSION = "v4.0.3";
const VERSION_TO_MORPH = "v3.2.2";

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

export default function Visualisation({
  version = CURRENT_TESTING_VERSION,
  styleIndex = 2,
}) {
  const [modelName, setModelName] = useState("");
  const [structure, setStructure] = useState([]);
  const style = STYLE_STRATEGIES[styleIndex];

  useEffect(() => {
    const name = getModelNameFromVersion(version);
    console.log(name, version);
    if (name) {
      setModelName(name);
      const modelStructure = getModelStructure(name);
      setStructure(modelStructure);
    } else {
      console.error(`No model found for version: ${version}`);
    }
  }, [version]);

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

  return (
    <Canvas
      camera={{
        ...style.camera,
        far: 500000,
      }}
    >
      <CommonScene style={style}>
        <ModelComponent structure={structure} style={style} model={modelName} />
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
      <OrbitControls enablePan={true} />
      <EffectComposer>
        {style.postprocessing && style.postprocessing.bloom && (
          <Bloom {...style.postprocessing.bloom} />
        )}
      </EffectComposer>
    </>
  );
}
