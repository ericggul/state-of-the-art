import React, { useRef } from "react";

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
import { TYPE_STYLES, DEFAULT_STYLE } from "../style/type";

import CommonScene from "../utils/CommonScene";

export default function ModelContainer({
  modelName,
  structure,
  modelGroupRef,
}) {
  const modelConfig = LAYER_CONFIGS[modelName];
  let ModelComponent;
  let typeStyle;

  if (modelConfig) {
    typeStyle = TYPE_STYLES[modelConfig.type] || DEFAULT_STYLE;

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
    typeStyle = DEFAULT_STYLE;
  }

  return (
    <CommonScene style={typeStyle}>
      <group ref={modelGroupRef}>
        {structure.length > 0 && (
          <ModelComponent
            structure={structure}
            style={typeStyle}
            model={modelName}
          />
        )}
      </group>
    </CommonScene>
  );
}
