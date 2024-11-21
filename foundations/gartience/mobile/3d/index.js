"use client";

import {
  useMemo,
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
} from "react";
import * as S from "./styles";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import DeviceOrientationControls from "./DeviceOrientationControls";

// Import ALL layer components from frontend
import BasicNNLayers from "@/foundations/frontend/arch/layers/BasicNNLayers";
import CNNLayers from "@/foundations/frontend/arch/layers/CNNLayers";
import TransformerLayers from "@/foundations/frontend/arch/layers/TransformerLayers";
import RNNLayers from "@/foundations/frontend/arch/layers/RNNLayers";
import VAELayers from "@/foundations/frontend/arch/layers/VAELayers";
import SelfSupervisedLayers from "@/foundations/frontend/arch/layers/SelfSupervisedLayers";
import GANLayers from "@/foundations/frontend/arch/layers/GANLayers";
import DiffusionLayers from "@/foundations/frontend/arch/layers/DiffusionLayers";
import MultiModalLayers from "@/foundations/frontend/arch/layers/MultiModalLayers";
import ReinforcementLayers from "@/foundations/frontend/arch/layers/ReinforcementLayers";
import HopfieldLayers from "@/foundations/frontend/arch/layers/HopfieldLayers";
import BoltzmannLayers from "@/foundations/frontend/arch/layers/BoltzmannLayers";

// Import configs and utils
import { LAYER_CONFIGS } from "@/foundations/frontend/arch-models/_structure";
import { TYPE_STYLES, DEFAULT_STYLE } from "@/foundations/frontend/style/type";
import { useModelStructure } from "@/components/frontend/utils";

// Import model info component
import ModelInfo from "./components/ModelInfo";

// Match MODEL_COMPONENTS exactly with frontend
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

export default function FC3D({
  enableDeviceControls = true,
  currentArchitectures = [
    {
      name: "Hopfield Network",
      version: "v2.0.1",
      year: "1943",
      place: "USA",
      citation: "McCulloch & Pitts",
      explanation: "The first artificial neuron model",
    },
  ],
}) {
  const {
    visualization: { modelName, structure },
  } = useModelStructure(currentArchitectures);

  // Match the same component selection logic as ModelContainer
  const { ModelComponent, style } = useMemo(() => {
    const modelConfig = LAYER_CONFIGS[modelName];
    if (!modelConfig) {
      console.warn(
        `No configuration found for model: ${modelName}. Defaulting to BasicNNLayers.`
      );
      return { ModelComponent: BasicNNLayers, style: DEFAULT_STYLE };
    }

    const typeStyle = TYPE_STYLES[modelConfig.type] || DEFAULT_STYLE;
    const component = MODEL_COMPONENTS[modelConfig.type];

    if (!component) {
      console.warn(
        `Unknown model type: ${modelConfig.type}. Defaulting to BasicNNLayers.`
      );
      return { ModelComponent: BasicNNLayers, style: typeStyle };
    }

    return { ModelComponent: component, style: typeStyle };
  }, [modelName]);

  return (
    <S.Container>
      <Canvas
        camera={{
          position: [-10, 0, 15],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 10, 10]} intensity={2} />
        <directionalLight position={[10, 0, 10]} intensity={2} />

        {structure && ModelComponent && (
          <ModelComponent
            structure={structure}
            style={style}
            model={modelName}
          />
        )}

        {enableDeviceControls && <DeviceOrientationControls />}
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
      <ModelInfo
        name={currentArchitectures[0]?.name}
        year={currentArchitectures[0]?.year}
      />
    </S.Container>
  );
}
