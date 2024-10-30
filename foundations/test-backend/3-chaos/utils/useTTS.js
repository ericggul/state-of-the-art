import { useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

export default function useTTS({ text }) {
  const utteranceRef = useRef(null);
  const synthRef = useRef(null);
  const distortionRef = useRef(null);
  const vibratoRef = useRef(null);
  const reverbRef = useRef(null);
  const gainNodeRef = useRef(null);

  const setupToneContext = useCallback(() => {
    if (!synthRef.current) {
      Tone.start();

      synthRef.current = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.005, decay: 0.1, sustain: 1, release: 0.1 },
      });

      distortionRef.current = new Tone.Distortion(0.1).toDestination();

      vibratoRef.current = new Tone.Vibrato({
        frequency: 5,
        depth: 0.1,
      }).toDestination();

      reverbRef.current = new Tone.Reverb({
        decay: 1.5,
        wet: 0.3,
      }).toDestination();

      gainNodeRef.current = new Tone.Gain(0.4).toDestination();

      synthRef.current.chain(
        vibratoRef.current,
        distortionRef.current,
        reverbRef.current,
        gainNodeRef.current
      );
    }
  }, []);

  const playGrotesqueTTS = useCallback(() => {
    if (!text) return;

    setupToneContext();

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.pitch = 0.9;
    utterance.rate = 0.95;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find((voice) => voice.name.includes("Google UK English Male")) ||
      voices[0];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      synthRef.current.triggerAttack("C3", "+0.05");
    };

    utterance.onend = () => {
      synthRef.current.triggerRelease("+0.05");
    };

    console.log("speaking", text);
    window.speechSynthesis.speak(utterance);
  }, [text, setupToneContext]);

  useEffect(() => {
    if (text) {
      playGrotesqueTTS();
    }

    return () => {
      window.speechSynthesis.cancel();
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
    };
  }, [text, playGrotesqueTTS]);

  return null;
}
