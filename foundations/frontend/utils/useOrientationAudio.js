import { useMemo, useCallback, useRef } from "react";
import * as Tone from "tone";
import * as THREE from "three";

export function useOrientationAudio() {
  const synthRef = useRef(null);
  const reverbRef = useRef(null);
  const delayRef = useRef(null);

  useMemo(() => {
    // Create a more complex, ambient synthesizer
    const synth = new Tone.PolySynth(Tone.AMSynth, {
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 1,
        release: 3,
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
    });

    // Create effects
    const reverb = new Tone.Reverb({
      decay: 5,
      wet: 0.6,
    });

    const delay = new Tone.FeedbackDelay({
      delayTime: 0.3,
      feedback: 0.4,
      wet: 0.3,
    });

    // Connect synth to effects chain
    synth.chain(delay, reverb, Tone.Destination);

    // Set initial volume
    synth.volume.value = -10;

    synthRef.current = synth;
    reverbRef.current = reverb;
    delayRef.current = delay;
  }, []);

  const playShakeSound = useCallback((accelMagnitude) => {
    const synth = synthRef.current;
    if (!synth) return;

    // Map acceleration magnitude to frequency
    const minFreq = 150;
    const maxFreq = 350;
    const frequency = THREE.MathUtils.mapLinear(
      accelMagnitude,
      0,
      2,
      minFreq,
      maxFreq
    );

    // Map acceleration magnitude to modulation frequency
    const minModFreq = 0.5;
    const maxModFreq = 2;
    const modFreq = THREE.MathUtils.mapLinear(
      accelMagnitude,
      0,
      2,
      minModFreq,
      maxModFreq
    );

    try {
      // Trigger a chord with the calculated frequency
      synth.triggerAttackRelease(
        [frequency, frequency * 1.25, frequency * 1.5],
        "4n"
      );
      synth.set({
        modulation: {
          frequency: modFreq,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateZoomAudio = useCallback((zoomFactor) => {
    const synth = synthRef.current;
    const reverb = reverbRef.current;
    const delay = delayRef.current;
    if (!synth || !reverb || !delay) return;

    // Map zoom factor to reverb decay
    const minDecay = 1;
    const maxDecay = 10;
    const reverbDecay = THREE.MathUtils.mapLinear(
      zoomFactor,
      0.01,
      3,
      minDecay,
      maxDecay
    );
    reverb.decay = reverbDecay;

    // Map zoom factor to delay feedback
    const minFeedback = 0.2;
    const maxFeedback = 0.6;
    const delayFeedback = THREE.MathUtils.mapLinear(
      zoomFactor,
      0.01,
      3,
      minFeedback,
      maxFeedback
    );
    delay.feedback.rampTo(delayFeedback, 0.1);

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

    // Adjust volume based on zoom
    const minVolume = -20;
    const maxVolume = -10;
    const volume = THREE.MathUtils.mapLinear(
      zoomFactor,
      0.01,
      3,
      minVolume,
      maxVolume
    );
    synth.volume.rampTo(volume, 0.1);
  }, []);

  const cleanup = useCallback(() => {
    if (synthRef.current) synthRef.current.dispose();
    if (reverbRef.current) reverbRef.current.dispose();
    if (delayRef.current) delayRef.current.dispose();
  }, []);

  return { playShakeSound, updateZoomAudio, cleanup };
}
