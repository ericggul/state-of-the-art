import * as S from "./styles";
import { useState, useEffect, useRef } from "react";

import * as Tone from "tone";

export default function Propagation({ propagatedState, setPropagatedState, layerIdx }) {
  const timeoutRef = useRef();

  console.log("7");

  useEffect(() => {
    if (propagatedState !== "idle") {
      simpleTone({ propagatedState, layerIdx });
      if (timeoutRef && timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setPropagatedState("idle");
      }, 100);

      return () => {
        if (timeoutRef && timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [propagatedState]);

  return (
    <S.Container>
      <S.Bg
        style={{
          opacity: propagatedState === "idle" ? 0 : 1,
        }}
      />
    </S.Container>
  );
}

async function simpleTone({ propagatedState, layerIdx }) {
  // Ensure Tone.js context is started
  await Tone.start();

  // Create a basic synth with the desired envelope settings and connect it to the main output (speakers)
  const synth = new Tone.PolySynth().toDestination();

  const now = Tone.now();

  //notes: all note from C2 to C3
  const NOTES = ["C5", "E5", "G5", "B5", "C6"];

  if (propagatedState === "propagation") {
    console.log("50");
    synth.triggerAttackRelease(NOTES[layerIdx % NOTES.length], "8n", now);
  } else {
    synth.triggerAttackRelease(NOTES[layerIdx % NOTES.length], "8n", now);
  }
}
