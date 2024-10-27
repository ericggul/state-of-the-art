import React, { useRef, useEffect } from "react";
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
  const { mobileVisibility } = useScreenStore();

  useEffect(() => {
    if (sound.current) {
      const volume = mobileVisibility ? 2 : 40;
      sound.current.setVolume(volume);
      sound.current.setRefDistance(distance);
    }
  }, [mobileVisibility, distance]);

  const handleLoad = () => {
    if (sound.current) {
      sound.current.play();
    }
  };

  return (
    <mesh position={[0, 0, 0]}>
      <DreiPositionalAudio
        ref={sound}
        url={url}
        distance={distance}
        loop={loop}
        onLoad={handleLoad}
      />
    </mesh>
  );
}
