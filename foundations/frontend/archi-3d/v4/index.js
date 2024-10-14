// Visualization.js
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Import styles and structures
import { STYLE_STRATEGIES } from "./style";
import {
  VIDEO_GEN_STRUCTURE,
  ALEXNET_STRUCTURE,
  GPT_STRUCTURE,
  VGGNET_STRUCTURE,
  LENET_STRUCTURE,
  LENET5_STRUCTURE,
  TRANSFORMER_STRUCTURE,
  LAYER_CONFIGS,
} from "./structure";

import CNNLayers from "./components/layers/CNNLayers";
import TransformerLayers from "./components/layers/TransformerLayers";

export default function Visualization({
  model = "transformer",
  styleIndex = 5,
}) {
  const style = STYLE_STRATEGIES[styleIndex];
  const modelConfig = LAYER_CONFIGS[model];

  const getStructure = (model) => {
    switch (model) {
      case "videogen":
        return VIDEO_GEN_STRUCTURE;
      case "gpt":
        return GPT_STRUCTURE;
      case "transformer":
        return TRANSFORMER_STRUCTURE;
      case "alexnet":
        return ALEXNET_STRUCTURE;
      case "vggnet":
        return VGGNET_STRUCTURE;
      case "lenet":
        return LENET_STRUCTURE;
      case "lenet5":
        return LENET5_STRUCTURE;
      default:
        return [];
    }
  };

  return (
    <Canvas camera={style.camera}>
      <CommonScene style={style}>
        {modelConfig && modelConfig.type === "transformer" ? (
          <TransformerLayers
            structure={getStructure(model)}
            style={style}
            model={model}
          />
        ) : (
          <CNNLayers
            structure={getStructure(model)}
            style={style}
            model={model}
          />
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
