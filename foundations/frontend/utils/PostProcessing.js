import React, { memo } from "react";
import {
  EffectComposer,
  Bloom,
  SMAA,
  BrightnessContrast,
  HueSaturation,
  Vignette,
  Outline,
  EdgeDetection,
  SSAO,
} from "@react-three/postprocessing";
import { BlendFunction, EdgeDetectionMode } from "postprocessing";

const PostProcessing = memo(function PostProcessing() {
  return (
    <EffectComposer>
      <SMAA />

      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={30}
        radius={0.2}
        intensity={20}
        luminanceInfluence={0.6}
        bias={0.5}
      />

      <EdgeDetection
        blendFunction={BlendFunction.OVERLAY}
        edgeStrength={0.8}
        pulseSpeed={0.0}
        visibleEdgeColor={0xffffff}
        hiddenEdgeColor={0x22090a}
        width={Resolutions.HALF}
        height={Resolutions.HALF}
        kernelSize={KernelSize.SMALL}
        blur={false}
        xRay={true}
      />

      <BrightnessContrast
        brightness={0.03}
        contrast={0.15}
        blendFunction={BlendFunction.NORMAL}
      />

      <HueSaturation saturation={0.15} hue={0.05} />

      <Vignette darkness={1} offset={0} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
});

export default PostProcessing;
