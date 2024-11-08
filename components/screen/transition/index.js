import * as S from "./styles";
import { useEffect, useState } from "react";

import useScreenStore from "@/components/screen/store";

const audioURL = "/audio/beep.mp3";

export default function Transition() {
  const [activate, setActivate] = useState(false);
  const { deviceIndex } = useScreenStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActivate(true);
    }, 300 + deviceIndex * 300);

    return () => clearTimeout(timeout);
  }, [deviceIndex]);

  return <>{activate && <BlueEl />}</>;
}

function BlueEl() {
  useEffect(() => {
    const audio = new Audio(audioURL);
    audio.loop = true;

    audio.play();

    return () => {
      audio.pause();
    };
  }, []);

  return <S.Container />;
}
