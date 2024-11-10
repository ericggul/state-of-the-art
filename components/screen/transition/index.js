import * as S from "./styles";
import { memo, useEffect, useState } from "react";

import useScreenStore from "@/components/screen/store";

const audioURL = "/audio/beep.mp3";

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActivate(true);
    }, 300 + deviceIndex * 300);

    return () => clearTimeout(timeout);
  }, [deviceIndex]);

  return <>{activate && <BlueEl />}</>;
});

BlueEl.displayName = "BlueEl";
Transition.displayName = "Transition";
export default Transition;
