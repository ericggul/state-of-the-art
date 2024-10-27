import { useMemo, useCallback } from "react";
import * as Tone from "tone";
import * as THREE from "three";

export function useOrientationAudio() {
  const synth = useMemo(() => {
    // Create a more complex synthesizer
    const s = new Tone.PolySynth(Tone.FMSynth, {
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
      },
      modulation: {
        type: "square",
      },
      modulationEnvelope: {
        attack: 0.5,
        decay: 0,
        sustain: 1,
        release: 0.5,
      },
    }).toDestination();

    // Set initial volume
    s.volume.value = -20;

    return s;
  }, []);

  const playShakeSound = useCallback(
    (accelMagnitude) => {
      // Map acceleration magnitude to frequency
      const minFreq = 200;
      const maxFreq = 600;
      const frequency = THREE.MathUtils.mapLinear(
        accelMagnitude,
        0,
        2,
        minFreq,
        maxFreq
      );

      // Map acceleration magnitude to modulation index
      const minIndex = 0;
      const maxIndex = 5;
      const modulationIndex = THREE.MathUtils.mapLinear(
        accelMagnitude,
        0,
        2,
        minIndex,
        maxIndex
      );

      try {
        // Trigger a note with the calculated frequency and modulation
        synth.triggerAttackRelease(frequency, "32n");
        synth.set({ modulationIndex });
      } catch (e) {
        console.error(e);
      }
    },
    [synth]
  );

  const updateZoomAudio = useCallback(
    (zoomFactor) => {
      // Map zoom factor to filter frequency
      const minFilterFreq = 200;
      const maxFilterFreq = 8000;
      const filterFreq = THREE.MathUtils.mapLinear(
        zoomFactor,
        0.01,
        3,
        minFilterFreq,
        maxFilterFreq
      );

      // Create or update a low-pass filter
      if (!synth.filter) {
        synth.filter = new Tone.Filter(filterFreq, "lowpass").toDestination();
        synth.connect(synth.filter);
      } else {
        synth.filter.frequency.rampTo(filterFreq, 0.1);
      }

      // Adjust volume based on zoom
      const minVolume = -30;
      const maxVolume = -10;
      const volume = THREE.MathUtils.mapLinear(
        zoomFactor,
        0.01,
        3,
        minVolume,
        maxVolume
      );
      synth.volume.rampTo(volume, 0.1);

      // Adjust harmonicity based on zoom
      const minHarmonicity = 0.5;
      const maxHarmonicity = 2;
      const harmonicity = THREE.MathUtils.mapLinear(
        zoomFactor,
        0.01,
        3,
        minHarmonicity,
        maxHarmonicity
      );
      synth.set({ harmonicity });
    },
    [synth]
  );

  const cleanup = useCallback(() => {
    synth.dispose();
  }, [synth]);

  return { playShakeSound, updateZoomAudio, cleanup };
}
