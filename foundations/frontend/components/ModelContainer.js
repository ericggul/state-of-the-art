import React, { useRef, useMemo, memo } from "react";

import { LAYER_CONFIGS, getModelStructure } from "../arch-models/_structure";
import BasicNNLayers from "../arch/layers/BasicNNLayers";
import CNNLayers from "../arch/layers/CNNLayers";
import TransformerLayers from "../arch/layers/TransformerLayers";
import RNNLayers from "../arch/layers/RNNLayers";
import VAELayers from "../arch/layers/VAELayers";
import SelfSupervisedLayers from "../arch/layers/SelfSupervisedLayers";
import GANLayers from "../arch/layers/GANLayers";
import DiffusionLayers from "../arch/layers/DiffusionLayers";
import MultiModalLayers from "../arch/layers/MultiModalLayers-original";
import ReinforcementLayers from "../arch/layers/ReinforcementLayers";
import HopfieldLayers from "../arch/layers/HopfieldLayers";
import BoltzmannLayers from "../arch/layers/BoltzmannLayers";
import { TYPE_STYLES, DEFAULT_STYLE } from "../style/type";

import CommonScene from "../utils/CommonScene";
import useScreenStore from "@/components/screen/store";

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

const getProjectorStyle = (isProjector, typeStyle) =>
  isProjector ? typeStyle : DEFAULT_STYLE;

const ModelContainer = memo(
  function ModelContainer({ modelName, structure, modelGroupRef }) {
    const isProjector = useScreenStore((state) => state.isProjector);
    const modelConfig = LAYER_CONFIGS[modelName];

    const { ModelComponent, typeStyle } = useMemo(() => {
      if (!modelConfig) {
        console.warn(
          `No configuration found for model: ${modelName}. Defaulting to BasicNNLayers.`
        );
        return { ModelComponent: BasicNNLayers, typeStyle: DEFAULT_STYLE };
      }

      const style = TYPE_STYLES[modelConfig.type] || DEFAULT_STYLE;
      const component = MODEL_COMPONENTS[modelConfig.type];

      if (!component) {
        console.warn(
          `Unknown model type: ${modelConfig.type}. Defaulting to BasicNNLayers.`
        );
        return { ModelComponent: BasicNNLayers, typeStyle: style };
      }

      return { ModelComponent: component, typeStyle: style };
    }, [modelConfig, modelName]);

    const finalStyle = useMemo(
      () => getProjectorStyle(isProjector, typeStyle),
      [isProjector, typeStyle]
    );

    const shouldRenderModel = structure.length > 0;

    return (
      <CommonScene style={finalStyle}>
        <group ref={modelGroupRef}>
          {shouldRenderModel && (
            <ModelComponent
              structure={structure}
              style={finalStyle}
              model={modelName}
            />
          )}
        </group>
      </CommonScene>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    return (
      prevProps.modelName === nextProps.modelName &&
      prevProps.modelGroupRef === nextProps.modelGroupRef &&
      prevProps.structure.length === nextProps.structure.length &&
      prevProps.structure.every(
        (item, index) =>
          JSON.stringify(item) === JSON.stringify(nextProps.structure[index])
      )
    );
  }
);

ModelContainer.displayName = "ModelContainer";
export default ModelContainer;
