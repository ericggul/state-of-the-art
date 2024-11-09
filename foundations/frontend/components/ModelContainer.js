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
//store
import useScreenStore from "@/components/screen/store";

// Move the mapping outside component for better performance
const MODEL_COMPONENTS = {
  basic_nn: BasicNNLayers,
  cnn: CNNLayers,
  transformer: TransformerLayers,
  rnn: RNNLayers,
  vae: VAELayers,
  self_supervised: SelfSupervisedLayers,
  gan: GANLayers,
  diffusion: DiffusionLayers,
  multi_modal: MultiModalLayers,
  reinforcement: ReinforcementLayers,
  hopfield: HopfieldLayers,
  boltzmann: BoltzmannLayers,
};

export default function ModelContainer({
  modelName,
  structure,
  modelGroupRef,
}) {
  const isProjector = useScreenStore((state) => state.isProjector);
  const modelConfig = LAYER_CONFIGS[modelName];
  let ModelComponent;
  let typeStyle;

  if (modelConfig) {
    typeStyle = TYPE_STYLES[modelConfig.type] || DEFAULT_STYLE;
    ModelComponent = MODEL_COMPONENTS[modelConfig.type];

    if (!ModelComponent) {
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
    <CommonScene style={isProjector ? typeStyle : DEFAULT_STYLE}>
      <group ref={modelGroupRef}>
        {structure.length > 0 && (
          <ModelComponent
            structure={structure}
            style={isProjector ? typeStyle : DEFAULT_STYLE}
            model={modelName}
          />
        )}
      </group>
    </CommonScene>
  );
}
