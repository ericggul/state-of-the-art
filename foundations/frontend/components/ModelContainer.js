import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { LAYER_CONFIGS, getModelStructure } from "../arch-models/_structure";
import BasicNNLayers from "../arch/layers/BasicNNLayers";
import CNNLayers from "../arch/layers/CNNLayers";
import TransformerLayers from "../arch/layers/TransformerLayers";
import RNNLayers from "../arch/layers/RNNLayers";
import VAELayers from "../arch/layers/VAELayers";
import SelfSupervisedLayers from "../arch/layers/SelfSupervisedLayers";
import GANLayers from "../arch/layers/GANLayers";
import DiffusionLayers from "../arch/layers/DiffusionLayers";
import MultiModalLayers from "../arch/layers/MultiModalLayers";
import ReinforcementLayers from "../arch/layers/ReinforcementLayers";
import HopfieldLayers from "../arch/layers/HopfieldLayers";
import BoltzmannLayers from "../arch/layers/BoltzmannLayers";

const ROTATION_SPEED = 0.0005; // Adjust this value to change rotation speed

export default function ModelContainer({
  modelName,
  structure,
  style,
  modelGroupRef,
}) {
  const rotationRef = useRef(0);

  // Slow continuous rotation
  useFrame(() => {
    if (modelGroupRef.current) {
      rotationRef.current += ROTATION_SPEED;
      modelGroupRef.current.rotation.y = rotationRef.current;
    }
  });

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
      case "hopfield":
        ModelComponent = HopfieldLayers;
        break;
      case "boltzmann":
        ModelComponent = BoltzmannLayers;
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
    <group ref={modelGroupRef}>
      {structure.length > 0 && (
        <ModelComponent structure={structure} style={style} model={modelName} />
      )}
    </group>
  );
}
