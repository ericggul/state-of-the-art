//implement postprocessing glitch effect

import {
  EffectComposer,
  Glitch,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { GlitchMode } from "postprocessing";
import useScreenStore from "@/components/screen/store";

export default function Wrapper() {
  const mobileVisibility = useScreenStore((state) => state.mobileVisibility);
  console.log("postprocessing", mobileVisibility);

  return <>{!mobileVisibility && <PostProcessing />}</>;
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Glitch
        delay={[0, 0]}
        duration={[0.2, 0.4]}
        strength={[0.5, 1.0]}
        mode={GlitchMode.CONSTANT_WILD}
        active={true} // Always active
        ratio={0.5}
      />
      <ChromaticAberration offset={[0.08, 0.08]} />
    </EffectComposer>
  );
}
