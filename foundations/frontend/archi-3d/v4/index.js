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

// Utility function to convert model name to variable name
function convertToVariableName(name) {
  return name.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}

// Utility function to map version to model name
function getModelNameFromVersion(version) {
  const model = OBJECT_ARRAY.find((item) => item.version === version);
  return model ? convertToVariableName(model.name) : null;
}

export default function Visualization({ version = "v1.0", styleIndex = 0 }) {
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
    <Canvas camera={style.camera}>
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
      <OrbitControls enablePan={true} maxPolarAngle={Math.PI / 2} />
      <EffectComposer>
        {style.postprocessing && style.postprocessing.bloom && (
          <Bloom {...style.postprocessing.bloom} />
        )}
      </EffectComposer>
    </>
  );
}
