import React, { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { PositionalAudio as DreiPositionalAudio } from "@react-three/drei";
import useScreenStore from "@/components/screen/store";
import * as THREE from "three";

const AUDIO_FILE = "/audio/idle/idle1126.wav";

export default function PositionalAudio({
  url = AUDIO_FILE,
  distance = 1,
  loop = true,
}) {
  const sound = useRef();
  const { camera } = useThree();
  const mobileVisibility = useScreenStore((state) => state.mobileVisibility);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (sound.current) {
      const volume = mobileVisibility ? 2 : 40;
      sound.current.setVolume(volume);
      sound.current.setRefDistance(distance);
    }
  }, [mobileVisibility, distance]);

  useEffect(() => {
    if (sound.current && !isPlaying) {
      sound.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleLoad = () => {
    if (sound.current) {
      sound.current.play();
      setIsPlaying(true);
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
