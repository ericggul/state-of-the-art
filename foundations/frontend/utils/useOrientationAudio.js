import { useMemo, useCallback, useEffect, useState } from "react";
import * as THREE from "three";

const AUDIO_FILE = "/audio/daisy/1.mp3";

export function useOrientationAudio() {
  const [audio, setAudio] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [gainNode, setGainNode] = useState(null);

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.1, context.currentTime); // Set initial gain to 10%
    setAudioContext(context);
    setGainNode(gain);

    fetch(AUDIO_FILE)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        setAudio(audioBuffer);
      })
      .catch((error) => console.error("Error loading audio:", error));

    return () => {
      context.close();
    };
  }, []);

  const playShakeSound = useCallback(
    (accelMagnitude) => {
      if (audioContext && audio && gainNode) {
        const source = audioContext.createBufferSource();
        source.buffer = audio;

        const playbackRate = THREE.MathUtils.mapLinear(
          accelMagnitude,
          0,
          2,
          0.5,
          1.5
        );
        source.playbackRate.value = playbackRate;

        const volume = THREE.MathUtils.mapLinear(
          accelMagnitude,
          0,
          2,
          0.05,
          0.2
        );
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

        source.connect(gainNode);
        source.start();
        source.stop(audioContext.currentTime + 0.5); // Limit sound duration to 0.5 seconds
      }
    },
    [audioContext, audio, gainNode]
  );

  const updateZoomAudio = useCallback(
    (zoomFactor) => {
      if (gainNode) {
        const volume = THREE.MathUtils.mapLinear(
          zoomFactor,
          0.01,
          3,
          0.02,
          0.15
        );
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      }
    },
    [gainNode, audioContext]
  );

  const cleanup = useCallback(() => {
    if (audioContext) {
      audioContext.close();
    }
  }, [audioContext]);

  return { playShakeSound, updateZoomAudio, cleanup };
}
