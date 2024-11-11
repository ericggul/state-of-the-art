import { useEffect, useRef, useCallback, useState } from "react";
import * as Tone from "tone";

export default function useDrumRhythm({ text }) {
  const [isReady, setIsReady] = useState(false);
  const kickRef = useRef(null);
  const snareRef = useRef(null);
  const hiHatRef = useRef(null);
  const patternRef = useRef(null);

  const setupToneContext = useCallback(async () => {
    if (!kickRef.current) {
      try {
        await Tone.start();

        // Load drum samples
        kickRef.current = new Tone.Player(
          "/audio/drum/kick.wav"
        ).toDestination();
        snareRef.current = new Tone.Player(
          "/audio/drum/snare.wav"
        ).toDestination();
        hiHatRef.current = new Tone.Player(
          "/audio/drum/hat.wav"
        ).toDestination();

        await Promise.all([
          kickRef.current.loaded,
          snareRef.current.loaded,
          hiHatRef.current.loaded,
        ]);

        setIsReady(true);
      } catch (error) {
        console.error("Error in setupToneContext:", error);
      }
    }
  }, []);

  const createPatternFromText = useCallback((text) => {
    const baseKickPattern = [1, 0, 0, 0, 1, 0, 0, 0]; // Simple rock beat
    const baseSnarePattern = [0, 0, 1, 0, 0, 0, 1, 0];
    const baseHiHatPattern = [1, 1, 1, 1, 1, 1, 1, 1];

    const kickPattern = [...baseKickPattern];
    const snarePattern = [...baseSnarePattern];
    const hiHatPattern = [...baseHiHatPattern];

    // Modify patterns based on text
    const charCodes = [...text].map((char) => char.charCodeAt(0));
    const sumCharCodes = charCodes.reduce((sum, code) => sum + code, 0);

    // Shift patterns based on the sum of character codes
    const shift = sumCharCodes % kickPattern.length;

    function shiftArray(arr, shift) {
      return arr.slice(shift).concat(arr.slice(0, shift));
    }

    const finalKickPattern = shiftArray(kickPattern, shift);
    const finalSnarePattern = shiftArray(snarePattern, shift);
    const finalHiHatPattern = shiftArray(hiHatPattern, shift);

    const pattern = finalKickPattern.map((_, i) => ({
      kick: finalKickPattern[i],
      snare: finalSnarePattern[i],
      hiHat: finalHiHatPattern[i],
    }));

    return pattern;
  }, []);

  const playDrumPattern = useCallback(
    (text) => {
      if (!isReady) return;

      const pattern = createPatternFromText(text);

      if (patternRef.current) {
        patternRef.current.dispose();
      }

      patternRef.current = new Tone.Sequence(
        (time, step) => {
          if (pattern[step].kick) kickRef.current.start(time);
          if (pattern[step].snare) snareRef.current.start(time);
          if (pattern[step].hiHat) hiHatRef.current.start(time);
        },
        Array.from({ length: pattern.length }, (_, i) => i),
        "8n" // Eighth-note subdivision
      ).start(0);

      // Set a moderate BPM
      Tone.Transport.bpm.value = 120;
      Tone.Transport.start();
    },
    [isReady, createPatternFromText]
  );

  useEffect(() => {
    setupToneContext();

    return () => {
      if (patternRef.current) {
        patternRef.current.dispose();
      }
      Tone.Transport.stop();
    };
  }, [setupToneContext]);

  useEffect(() => {
    if (text && isReady) {
      playDrumPattern(text);
    }
  }, [text, isReady, playDrumPattern]);

  return null;
}
