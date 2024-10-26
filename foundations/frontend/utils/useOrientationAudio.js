import { useMemo, useCallback } from "react";
import * as Tone from "tone";
import * as THREE from "three";

export function useOrientationAudio() {
  const synth = useMemo(() => {
    const s = new Tone.MonoSynth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.5 },
    }).toDestination();
    s.volume.value = -25; // Slightly lower initial volume
    return s;
  }, []);

  const playShakeSound = useCallback(
    (accelMagnitude) => {
      const shakeFrequency = THREE.MathUtils.mapLinear(
        accelMagnitude,
        0,
        2,
        150,
        600
      );
      try {
        synth.triggerAttackRelease(shakeFrequency, "32n", undefined, 0.3);
      } catch (e) {
        console.log(e);
      }
    },
    [synth]
  );

  const updateZoomAudio = useCallback(
    (zoomFactor) => {
      const zoomFrequency = THREE.MathUtils.mapLinear(
        zoomFactor,
        0.01,
        3,
        120,
        800
      );
      synth.frequency.rampTo(zoomFrequency, 0.2);
      const zoomVolume = THREE.MathUtils.mapLinear(
        zoomFactor,
        0.01,
        3,
        -35,
        -15
      );
      synth.volume.rampTo(zoomVolume, 0.2);
    },
    [synth]
  );

  const cleanup = useCallback(() => {
    synth.dispose();
  }, [synth]);

  return { synth, playShakeSound, updateZoomAudio, cleanup };
}
