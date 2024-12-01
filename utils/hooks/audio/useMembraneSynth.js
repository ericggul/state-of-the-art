import { useEffect, useRef } from "react";
import * as Tone from "tone";

export default function useMembraneSynth(value, options = {}) {
  const synthRef = useRef(null);
  const prevValueRef = useRef("");

  // Initialize synth
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        synthRef.current = new Tone.MembraneSynth().toDestination();
        synthRef.current.volume.value = options.volume ?? -10;
      }

      return () => {
        if (synthRef.current) synthRef.current.dispose();
      };
    } catch (e) {
      console.log(e);
    }
  }, [options.volume]);

  // Play sound on value change
  useEffect(() => {
    if (value !== prevValueRef.current && synthRef.current) {
      try {
        synthRef.current.triggerAttackRelease(
          options.note ?? "C2",
          options.duration ?? "16n"
        );
      } catch (e) {
        console.error("Audio playback error:", e);
      }
      prevValueRef.current = value;
    }
  }, [value, options.note, options.duration]);
}
