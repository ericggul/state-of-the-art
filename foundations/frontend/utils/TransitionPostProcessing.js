import React, { memo } from "react";
import {
  EffectComposer,
  Glitch,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import useScreenStore from "@/components/screen/store";

const PostProcessing = memo(function PostProcessing() {
  return (
    <EffectComposer>
      <Glitch
        delay={[0, 0]}
        duration={[0.2, 0.4]}
        strength={[0.5, 1.0]}
        mode={GlitchMode.CONSTANT_WILD}
        active={true}
        ratio={0.5}
      />
      <ChromaticAberration offset={[0.08, 0.08]} />
    </EffectComposer>
  );
});

const Wrapper = memo(function Wrapper() {
  const mobileVisibility = useScreenStore((state) => state.mobileVisibility);

  return <>{!mobileVisibility && <PostProcessing />}</>;
});

PostProcessing.displayName = "PostProcessing";
Wrapper.displayName = "PostProcessingWrapper";

export default Wrapper;
