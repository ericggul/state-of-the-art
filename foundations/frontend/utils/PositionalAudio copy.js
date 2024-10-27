import React, { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { PositionalAudio as DreiPositionalAudio } from "@react-three/drei";

import useScreenStore from "@/components/screen/store";

const AUDIO_FILE = "/audio/daisy/1.mp3";

export default function PositionalAudio({
  url = AUDIO_FILE,
  distance = 1,
  loop = true,
}) {
  const sound = useRef();
  const { camera } = useThree();
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(2);

  const { mobileVisibility } = useScreenStore();

  //if mobile not visible volume 20
  useEffect(() => {
    if (!mobileVisibility) {
      setVolume(40);
    } else {
      setVolume(2);
    }
  }, [mobileVisibility]);

  useEffect(() => {
    const handleInteraction = () => {
      if (sound.current && !isReady) {
        sound.current.play();
        setIsReady(true);
        window.removeEventListener("click", handleInteraction);
      }
    };

    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, [isReady]);

  useEffect(() => {
    if (sound.current) {
      sound.current.setVolume(volume);
      sound.current.setRefDistance(distance);
    }
  }, [volume, distance]);

  return (
    <mesh position={[0, 0, 0]}>
      <DreiPositionalAudio
        ref={sound}
        url={url}
        distance={distance}
        loop={loop}
      />
    </mesh>
  );
}
