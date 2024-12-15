import { useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";

const NEW_AUDIO = "/audio/backend/loop1214-1.wav";

export default function useAudio() {
  const stage = useScreenStore((state) => state.stage);
  const isProjector = useScreenStore((state) => state.isProjector);
  const mainAudioRef = useRef(null);

  useEffect(() => {
    if (stage === "Backend" && isProjector) {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      mainAudioRef.current = new Audio(NEW_AUDIO);
      mainAudioRef.current.loop = true;

      mainAudioRef.current.load();
      mainAudioRef.current
        .play()
        .catch((error) => console.error("Main audio playback failed:", error));
    } else {
      // Pause both audio tracks when not in Backend stage
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
    }

    // Cleanup function
    return () => {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current = null;
      }
    };
  }, [stage, isProjector]);

  return null;
}
