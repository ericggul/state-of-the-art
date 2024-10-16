// Visualization.js
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Import styles and structures
import { STYLE_STRATEGIES } from "./style";
import { LAYER_CONFIGS, getModelStructure } from "./structure";

import CNNLayers from "./components/layers/CNNLayers";
import TransformerLayers from "./components/layers/TransformerLayers";
import BasicNNLayers from "./components/layers/BasicNNLayers";

export default function Visualization({ model = "basic_nn", styleIndex = 2 }) {
  const style = STYLE_STRATEGIES[styleIndex];
  const modelConfig = LAYER_CONFIGS[model];
  const structure = getModelStructure(model);

  return (
    <Canvas camera={style.camera}>
      <CommonScene style={style}>
        {modelConfig && modelConfig.type === "transformer" ? (
          <TransformerLayers
            structure={structure}
            style={style}
            model={model}
          />
        ) : modelConfig && modelConfig.type === "basic_nn" ? (
          <BasicNNLayers structure={structure} style={style} model={model} />
        ) : (
          <CNNLayers structure={structure} style={style} model={model} />
        )}
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
