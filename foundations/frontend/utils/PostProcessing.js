import React, { memo } from "react";
import {
  EffectComposer,
  Bloom,
  SMAA,
  BrightnessContrast,
  HueSaturation,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const PostProcessing = memo(function PostProcessing() {
  return (
    <EffectComposer>
      <SMAA />

      {/* <Bloom
        intensity={0.5}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.9}
        mipmapBlur={true}
      /> */}

      <BrightnessContrast
        brightness={0.03}
        contrast={0.1}
        blendFunction={BlendFunction.NORMAL}
      />

      <HueSaturation saturation={0.1} hue={0} />

      <Vignette darkness={1} offset={0} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
});

export default PostProcessing;
