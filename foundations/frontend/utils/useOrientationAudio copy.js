import { useMemo, useCallback } from "react";
import * as Tone from "tone";
import * as THREE from "three";

export function useOrientationAudio() {
  const synth = useMemo(() => {
    const s = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3,
      modulationIndex: 10,
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.1,
        release: 0.3,
      },
      modulation: { type: "square" },
      modulationEnvelope: {
        attack: 0.5,
        decay: 0,
        sustain: 1,
        release: 0.5,
      },
    }).toDestination();
    s.volume.value = 10; // Adjust initial volume
    return s;
  }, []);

  const playShakeSound = useCallback(
    (accelMagnitude) => {
      const baseFrequency = THREE.MathUtils.mapLinear(
        accelMagnitude,
        0,
        2,
        300,
        1200
      );
      try {
        synth.triggerAttackRelease(
          [baseFrequency, baseFrequency * 1.5],
          "16n",
          undefined,
          0.3
        );
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
        240,
        1600
      );
      synth.set({
        frequency: zoomFrequency,
        harmonicity: THREE.MathUtils.mapLinear(zoomFactor, 0.01, 3, 1, 5),
      });
      const zoomVolume = THREE.MathUtils.mapLinear(
        zoomFactor,
        0.01,
        3,
        -30,
        -10
      );
      synth.volume.rampTo(zoomVolume, 0.1);
    },
    [synth]
  );

  const cleanup = useCallback(() => {
    synth.dispose();
  }, [synth]);

  return { synth, playShakeSound, updateZoomAudio, cleanup };
}
