import { useEffect, useRef, useCallback, useState } from "react";
import * as Tone from "tone";

export default function useDrumRhythm({ text }) {
  const [isReady, setIsReady] = useState(false);
  const kickRef = useRef(null);
  const snareRef = useRef(null);
  const hiHatRef = useRef(null);
  const patternRef = useRef(null);

  const setupToneContext = useCallback(async () => {
    console.log("Setting up Tone context");
    if (!kickRef.current) {
      try {
        await Tone.start();
        console.log("Tone started");

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

        console.log("Players created, waiting for samples to load");
        await Promise.all([
          kickRef.current.loaded,
          snareRef.current.loaded,
          hiHatRef.current.loaded,
        ]);

        console.log("All samples loaded");
        setIsReady(true);
      } catch (error) {
        console.error("Error in setupToneContext:", error);
      }
    }
  }, []);

  const createChaoticPatternFromText = useCallback((text) => {
    const length = 16; // Increased pattern length to 16 steps for more complexity
    const pattern = [];
    const charCodes = [...text].map((char) => char.charCodeAt(0));

    // Generate a chaotic pattern with randomness
    for (let i = 0; i < length; i++) {
      const charCode = charCodes[i % charCodes.length];
      const isKick = Math.random() < 0.7 || charCode % 2 === 0; // 70% chance to play a kick
      const isSnare = Math.random() < 0.5 || charCode % 3 === 0; // 50% chance to play a snare
      const isHiHat = Math.random() < 0.8 || charCode % 5 === 0; // 80% chance to play a hi-hat

      pattern.push({
        kick: isKick,
        snare: isSnare,
        hiHat: isHiHat,
      });
    }

    return pattern;
  }, []);

  const playDrumPattern = useCallback(
    (text) => {
      console.log("Attempting to play drum pattern, isReady:", isReady);
      if (!isReady) return;

      const pattern = createChaoticPatternFromText(text);
      console.log("Created pattern:", pattern);

      if (patternRef.current) {
        patternRef.current.dispose();
      }

      patternRef.current = new Tone.Sequence(
        (time, step) => {
          console.log("Playing step:", step);

          // Increase chaos with random fills and stutters
          if (Math.random() < 0.2) {
            if (pattern[step].kick) kickRef.current.start(time);
            if (pattern[step].snare)
              snareRef.current.start(time + Math.random() * 0.05);
            if (pattern[step].hiHat)
              hiHatRef.current.start(time + Math.random() * 0.1);
          } else {
            if (pattern[step].kick) kickRef.current.start(time);
            if (pattern[step].snare) snareRef.current.start(time);
            if (pattern[step].hiHat) hiHatRef.current.start(time);
          }
        },
        Array.from({ length: pattern.length }, (_, i) => i),
        "16n" // 16th-note subdivision for faster, dense patterns
      ).start(0);

      // Set higher BPM and start the Transport
      Tone.Transport.bpm.value = 160; // Increased BPM for a faster feel
      Tone.Transport.start();
      console.log("Tone Transport started");
    },
    [isReady, createChaoticPatternFromText]
  );

  useEffect(() => {
    console.log("Setting up Tone context (useEffect)");
    setupToneContext();

    return () => {
      console.log("Cleaning up");
      if (patternRef.current) {
        patternRef.current.dispose();
      }
      Tone.Transport.stop();
    };
  }, [setupToneContext]);

  useEffect(() => {
    console.log("Text or isReady changed. Text:", text, "isReady:", isReady);
    if (text && isReady) {
      playDrumPattern(text);
    }
  }, [text, isReady, playDrumPattern]);

  return null;
}
