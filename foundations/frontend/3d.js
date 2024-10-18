// Visualization.js
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

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

import AvatarModel from "@/foundations/frontend/avatar/model";
import CommonScene from "./style/common-scene";

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

//styleidx
//0: subtle red
//1: judd red
//2: seagram green
//3: subtle green
//4: subtle blue

export default function Visualisation({
  version = CURRENT_TESTING_VERSION,
  styleIndex = 0,
}) {
  const [modelName, setModelName] = useState("");
  const [structure, setStructure] = useState([]);
  const style = STYLE_STRATEGIES[styleIndex];

  useEffect(() => {
    const name = getModelNameFromVersion(version);
    if (name) {
      setModelName(name);
      const modelStructure = getModelStructure(name);
      setStructure(modelStructure);
    } else {
      console.log(`No model found for version: ${version}`);
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
      gl={{ alpha: true, antialias: true }}
    >
      <CommonScene style={style}>
        <ModelComponent structure={structure} style={style} model={modelName} />
        <AvatarModel />
      </CommonScene>
    </Canvas>
  );
}
