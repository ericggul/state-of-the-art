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
} from "./structure";

import VideoGenLayers from "./components/layers/VideoGenLayers";
import CNNLayers from "./components/layers/CNNLayers";
import TransformerLayers from "./components/layers/TransformerLayers";

export default function Visualization({ model = "gpt", styleIndex = 7 }) {
  const style = STYLE_STRATEGIES[styleIndex];

  return (
    <Canvas camera={style.camera}>
      <CommonScene style={style}>
        {model === "alexnet" && (
          <CNNLayers
            structure={ALEXNET_STRUCTURE}
            style={style}
            model={model}
          />
        )}
        {model === "videoGen" && (
          <VideoGenLayers
            structure={VIDEO_GEN_STRUCTURE}
            style={style}
            model={model}
          />
        )}
        {model === "gpt" && (
          <TransformerLayers
            structure={GPT_STRUCTURE}
            style={style}
            model={model}
          />
        )}
        {model === "vggnet" && (
          <CNNLayers structure={VGGNET_STRUCTURE} style={style} model={model} />
        )}
        {model === "lenet" && (
          <CNNLayers structure={LENET_STRUCTURE} style={style} model={model} />
        )}
        {model === "lenet5" && (
          <CNNLayers structure={LENET5_STRUCTURE} style={style} model={model} />
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
