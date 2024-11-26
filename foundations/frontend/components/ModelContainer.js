import React, { useRef, useMemo, memo, useState, useEffect } from "react";

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

//type v2: 1125
//type v3: 1126, 쨍한 느낌 주기
import { TYPE_STYLES, DEFAULT_STYLE } from "../style/type-v3";

import CommonScene from "../utils/CommonScene";
import useScreenStore from "@/components/screen/store";
import LoadingUI from "../components/LoadingUI";

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
  function ModelContainer({
    modelName,
    structure,
    modelGroupRef,
    isLoading,
    setIsLoading,
  }) {
    const isProjector = useScreenStore((state) => state.isProjector);
    const modelConfig = LAYER_CONFIGS[modelName];
    const modelLoadedRef = useRef(false);

    // Track when model is actually loaded
    useEffect(() => {
      if (structure.length > 0 && modelGroupRef.current) {
        // Wait for the next frame to ensure the model is rendered
        requestAnimationFrame(() => {
          // Add a small delay to account for any animations/transitions
          setTimeout(() => {
            if (modelGroupRef.current) {
              setIsLoading(false);
              modelLoadedRef.current = true;
            }
          }, 500);
        });
      }

      return () => {
        modelLoadedRef.current = false;
      };
    }, [structure, modelGroupRef, setIsLoading]);

    // Reset loading state when model changes
    useEffect(() => {
      modelLoadedRef.current = false;
    }, [modelName]);

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
          {isLoading && <LoadingUI />}
        </group>
      </CommonScene>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.modelName === nextProps.modelName &&
      prevProps.modelGroupRef === nextProps.modelGroupRef &&
      prevProps.isLoading === nextProps.isLoading &&
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
