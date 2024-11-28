"use client";

import React, {
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
import useMobileStore from "../store";

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
import {
  TYPE_STYLES,
  DEFAULT_STYLE,
} from "@/foundations/frontend/style/type-v2";
import { useModelStructure } from "@/components/frontend/utils";

// Import model info component
import ModelInfo from "./components/ModelInfo";

// Import LoadingUI component
import LoadingUI from "@/foundations/frontend/components/LoadingUI";

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

export default React.memo(function FC3D({ enableDeviceControls = true }) {
  const architectures = useMobileStore((state) => state.architectures);
  const [isLoading, setIsLoading] = useState(true);
  const modelGroupRef = useRef(null);

  const {
    visualization: { modelName, structure },
  } = useModelStructure(
    architectures.length > 0
      ? architectures
      : [
          {
            name: "Perceptron",
            year: 1958,
            place: "Frank Rosenblatt, Cornell Aeronautical Laboratory",
            citation: 13000,
            explanation:
              "Introduced the perceptron algorithm, the first trainable neural network using supervised learning.",
          },
          // {
          //   name: "Hopfield Network",
          //   version: "v2.0.1",
          //   year: "1943",
          //   place: "USA",
          //   citation: "McCulloch & Pitts",
          //   explanation: "The first artificial neuron model",
          // },
        ]
  );

  // Reset loading state ONLY when architectures change
  useEffect(() => {
    setIsLoading(true);
  }, [architectures]);

  // Only set loading to false when structure is ready
  useEffect(() => {
    if (structure && modelGroupRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (modelGroupRef.current) {
            setIsLoading(false);
          }
        }, 500);
      });
    }
  }, [structure]); // Now structure is defined when this effect runs

  const raisePhone = useMemo(
    () =>
      architectures.length > 0 &&
      architectures.find((arch) => arch.name === "PPO"),
    [architectures]
  );

  console.log(raisePhone, architectures);

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
      <Suspense fallback={null}>
        <Canvas
          camera={{
            position: [-15, 0, 20],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          frameloop="demand"
          gl={{
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: true,
            alpha: false,
          }}
        >
          <Suspense fallback={null}>
            <Environment
              files={`/3d/environment/sky.hdr`}
              intensity={style.lighting.envIntensity || 0.1}
              blurriness={style.lighting.envMapBlurriness || 0.5}
            />
          </Suspense>

          <pointLight position={[10, 10, 10]} />
          <directionalLight position={[0, 10, 10]} intensity={2} />
          <directionalLight position={[10, 0, 10]} intensity={2} />

          <group ref={modelGroupRef}>
            {structure && ModelComponent && (
              <ModelComponent
                structure={structure}
                style={style}
                model={modelName}
              />
            )}
            {isLoading && <LoadingUI />}
          </group>

          {enableDeviceControls && <DeviceOrientationControls />}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />
        </Canvas>
      </Suspense>
      <ModelInfo name={architectures[0]?.name} year={architectures[0]?.year} />
      {raisePhone && <S.RaisePhone>Raise Your Phone</S.RaisePhone>}
    </S.Container>
  );
});
