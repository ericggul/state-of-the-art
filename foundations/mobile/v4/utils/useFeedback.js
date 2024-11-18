import { useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

export default function useListFeedback(activeIndex, isEnabled = true) {
  const synthRef = useRef(null);

  // Initialize synth
  useEffect(() => {
    // Create membrane synth with custom parameters for more audible sound
    synthRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.2, // Increased for more pronounced pitch movement
      octaves: 2, // Reduced octaves for clearer tone
      oscillator: {
        type: "triangle", // Changed to triangle for richer harmonics
      },
      envelope: {
        attack: 0.005, // Slightly longer attack for more presence
        decay: 0.2, // Shorter decay for punchier sound
        sustain: 0.02, // Slightly increased sustain
        release: 0.8, // Shorter release for tighter sound
      },
    }).toDestination();

    // Increased volume for more audibility
    synthRef.current.volume.value = 0; // Increased from -10 to -5

    // Cleanup
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  // Handle feedback when active index changes
  useEffect(() => {
    if (!isEnabled || activeIndex === null) return;

    const playFeedback = async () => {
      try {
        // Start audio context if needed
        await Tone.start();

        // Play sound
        if (synthRef.current) {
          // Higher pitch for more audibility
          const pitch = "G2"; // Changed from C2 to G2 for more presence
          synthRef.current.triggerAttackRelease(pitch, "0.15"); // Slightly longer duration
        }

        // Increased vibration for more noticeable feedback
        if ("vibrate" in navigator) {
          navigator.vibrate(20); // Increased from 50ms to 70ms
        }
      } catch (error) {
        console.error("Error playing feedback:", error);
      }
    };

    playFeedback();
  }, [activeIndex, isEnabled]);

  // Method to manually trigger feedback
  const triggerFeedback = useCallback(async () => {
    if (!isEnabled) return;

    try {
      await Tone.start();
      if (synthRef.current) {
        synthRef.current.triggerAttackRelease("C2", "0.15");
      }
      if ("vibrate" in navigator) {
        navigator.vibrate(20);
      }
    } catch (error) {
      console.error("Error triggering feedback:", error);
    }
  }, [isEnabled]);

  return { triggerFeedback };
}
