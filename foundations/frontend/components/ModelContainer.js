import React, { useRef, useMemo } from "react";

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

// Add style helper function outside component
const getProjectorStyle = (isProjector, typeStyle) =>
  isProjector ? typeStyle : DEFAULT_STYLE;

export default function ModelContainer({
  modelName,
  structure,
  modelGroupRef,
}) {
  const isProjector = useScreenStore((state) => state.isProjector);
  const modelConfig = LAYER_CONFIGS[modelName];

  // Memoize component and typeStyle selection
  const { ModelComponent, typeStyle } = useMemo(() => {
    if (modelConfig) {
      const style = TYPE_STYLES[modelConfig.type] || DEFAULT_STYLE;
      const component = MODEL_COMPONENTS[modelConfig.type];

      if (!component) {
        console.warn(
          `Unknown model type: ${modelConfig.type}. Defaulting to BasicNNLayers.`
        );
        return { ModelComponent: BasicNNLayers, typeStyle: style };
      }

      return { ModelComponent: component, typeStyle: style };
    }

    console.warn(
      `No configuration found for model: ${modelName}. Defaulting to BasicNNLayers.`
    );
    return { ModelComponent: BasicNNLayers, typeStyle: DEFAULT_STYLE };
  }, [modelConfig, modelName]);

  // Memoize final style calculation
  const finalStyle = useMemo(
    () => getProjectorStyle(isProjector, typeStyle),
    [isProjector, typeStyle]
  );

  return (
    <CommonScene style={finalStyle}>
      <group ref={modelGroupRef}>
        {structure.length > 0 && (
          <ModelComponent
            structure={structure}
            style={finalStyle}
            model={modelName}
          />
        )}
      </group>
    </CommonScene>
  );
}
