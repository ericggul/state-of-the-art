import * as S from "./styles";
import { memo, useEffect, useState } from "react";
import useScreenStore from "@/components/screen/store";
import { iterationSpeedMultiplier } from "@/utils/constant";

const audioURL = "/audio/beep.mp3";
import * as CONST from "@/utils/constant";

const BlueEl = memo(function BlueEl() {
  useEffect(() => {
    const audio = new Audio(audioURL);
    audio.loop = true;
    audio.play();
    return () => {
      audio.pause();
    };
  }, []);

  return <S.Container />;
});

const Transition = memo(function Transition() {
  const [activate, setActivate] = useState(false);
  const deviceIndex = useScreenStore((state) => state.deviceIndex);
  const iteration = useScreenStore((state) => state.iteration);

  useEffect(() => {
    const baseDelay =
      CONST.BASE_DELAY + deviceIndex * CONST.DEVICE_DELAY_MULTIPLIER;
    const adjustedDelay = baseDelay * iterationSpeedMultiplier(iteration);

    const timeout = setTimeout(() => {
      setActivate(true);
    }, adjustedDelay);

    return () => clearTimeout(timeout);
  }, [deviceIndex]);

  return <>{activate && <BlueEl />}</>;
});

BlueEl.displayName = "BlueEl";
Transition.displayName = "Transition";
export default Transition;
