import * as S from "./styles";
import { memo, useEffect, useState } from "react";
import useScreenStore from "@/components/screen/store";
import { iterationSpeedMultiplier } from "@/utils/constant";

const audio1 = "/audio/transition/transition2.wav";
const audio2 = "/audio/transition/beep1212.wav";
import * as CONST from "@/utils/constant";

const BlueEl = memo(function BlueEl() {
  return <S.Container />;
});

const Transition = memo(function Transition() {
  const [activate, setActivate] = useState(false);
  const deviceIndex = useScreenStore((state) => state.deviceIndex);
  const iteration = useScreenStore((state) => state.iteration);
  const isProjector = useScreenStore((state) => state.isProjector);

  useEffect(() => {
    const baseDelay =
      CONST.BASE_DELAY + deviceIndex * CONST.DEVICE_DELAY_MULTIPLIER;
    const adjustedDelay = baseDelay * iterationSpeedMultiplier(iteration);
    const adjustedDelay2 =
      CONST.TRANSITION * iterationSpeedMultiplier(iteration);

    const timeout = setTimeout(() => {
      setActivate(true);
    }, adjustedDelay);

    const timeout2 = setTimeout(() => {
      setActivate(false);
    }, adjustedDelay2);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, [deviceIndex]);

  useEffect(() => {
    if (isProjector) {
      const audio = new Audio(audio1);
      // audio.loop = true;
      audio.playbackRate = 1 / iterationSpeedMultiplier(iteration);
      audio.play();

      return () => {
        audio.pause();
      };
    }
  }, [isProjector]);

  useEffect(() => {
    try {
      const audio = new Audio(audio2);
      if (activate) {
        audio.loop = true;
        audio.playbackRate = 1 / iterationSpeedMultiplier(iteration);
        audio.play();
      }

      return () => {
        if (audio) {
          audio.pause();
        }
      };
    } catch (e) {
      console.log(e);
    }
  }, [activate]);

  return <>{activate && <BlueEl />}</>;
});

BlueEl.displayName = "BlueEl";
Transition.displayName = "Transition";
export default Transition;
