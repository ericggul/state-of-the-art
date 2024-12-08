import useScreenStore from "@/components/screen/store";
import { useEffect, useState } from "react";
import { MODEL_TYPE_MAP } from "@/utils/constant/modelTypes";

const SOUND_BASE_URL = "/audio/change/";

export default function AudioTransition() {
  const currentArchitectures = useScreenStore(
    (state) => state.currentArchitectures
  );
  const [audio] = useState(new Audio());

  useEffect(() => {
    if (!currentArchitectures?.length) return;

    const { category } = currentArchitectures[0];
    const categoryIndex = Object.keys(MODEL_TYPE_MAP).indexOf(category);

    if (categoryIndex !== -1) {
      audio.src = `${SOUND_BASE_URL}${categoryIndex}.wav`;
      audio
        .play()
        .catch((error) => console.error("Audio playback failed:", error));
    }
  }, [currentArchitectures, audio]);

  return null;
}
