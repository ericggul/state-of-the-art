import * as S from "./styles";
import { memo, useEffect, useState, useRef } from "react";
import useScreenStore from "@/components/screen/store";
import { iterationSpeedMultiplier } from "@/utils/constant";

const audio1 = "/audio/transition/transition2.wav";
const audio2 = "/audio/transition/beep1.wav";
import * as CONST from "@/utils/constant";

const BlueEl = memo(function BlueEl() {
  return <S.Container />;
});

const Transition = memo(function Transition() {
  const [activate, setActivate] = useState(false);
  const deviceIndex = useScreenStore((state) => state.deviceIndex);
  const iteration = useScreenStore((state) => state.iteration);
  const isProjector = useScreenStore((state) => state.isProjector);
  const audioRef = useRef(null);

  useEffect(() => {
    const baseDelay =
      CONST.BASE_DELAY + deviceIndex * CONST.DEVICE_DELAY_MULTIPLIER;
    const adjustedDelay = baseDelay * iterationSpeedMultiplier(iteration);
    const adjustedDelay2 =
      CONST.TIMEOUTS.TRANSITION * iterationSpeedMultiplier(iteration);

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

      audio.playbackRate = 1 / iterationSpeedMultiplier(iteration);
      audio.play();

      return () => {
        audio.pause();
      };
    }
  }, [isProjector]);

  useEffect(() => {
    try {
      audioRef.current = new Audio(audio2);
      audioRef.current.playbackRate = 1 / iterationSpeedMultiplier(iteration);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (activate && audioRef.current) {
      audioRef.current.play();
    }
  }, [activate]);

  return <>{activate && <BlueEl />}</>;
});

BlueEl.displayName = "BlueEl";
Transition.displayName = "Transition";
export default Transition;
