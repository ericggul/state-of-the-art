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

// Import existing components from frontend
import BasicNNLayers from "@/foundations/frontend/arch/layers/BasicNNLayers";
import CNNLayers from "@/foundations/frontend/arch/layers/CNNLayers";
import VAELayers from "@/foundations/frontend/arch/layers/VAELayers";
import TransformerLayers from "@/foundations/frontend/arch/layers/TransformerLayers";
import RNNLayers from "@/foundations/frontend/arch/layers/RNNLayers";

// Import configs and utils
import { LAYER_CONFIGS } from "@/foundations/frontend/arch-models/_structure";
import { TYPE_STYLES, DEFAULT_STYLE } from "@/foundations/frontend/style/type";
import { useModelStructure } from "@/components/frontend/utils";

const MODEL_COMPONENTS = {
  basic_nn: BasicNNLayers,
  cnn: CNNLayers,
  transformer: TransformerLayers,
  rnn: RNNLayers,
  vae: VAELayers,
};

export default function FC3D({
  enableDeviceControls = true,
  currentArchitectures = [
    {
      name: "MCCULLOCH_PITTS_NEURON",
      version: "v1.0",
      year: "1943",
      place: "USA",
      citation: "McCulloch & Pitts",
      explanation: "The first artificial neuron model",
    },
  ],
}) {
  // Use the same model structure hook from frontend
  const {
    visualization: { modelName, structure },
  } = useModelStructure(currentArchitectures);

  // Get the appropriate component and style based on model type
  const { ModelComponent, style } = useMemo(() => {
    const modelConfig = LAYER_CONFIGS[modelName];
    if (!modelConfig) {
      return {
        ModelComponent: BasicNNLayers,
        style: DEFAULT_STYLE,
      };
    }

    const component = MODEL_COMPONENTS[modelConfig.type];
    const typeStyle = TYPE_STYLES[modelConfig.type] || DEFAULT_STYLE;

    return {
      ModelComponent: component || BasicNNLayers,
      style: typeStyle,
    };
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
    </S.Container>
  );
}
