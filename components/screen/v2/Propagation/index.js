import * as S from "./styles";
import { useState, useEffect, useRef } from "react";

import useResize from "@/utils/hooks/useResize";
import * as Tone from "tone";

export default function Propagation({ propagations, setPropagations, latestPropagation, layerIdx }) {
  const storedPropagationsRef = useRef([]);

  useEffect(() => {
    if (latestPropagation) {
      simpleTone({ propagateState: latestPropagation.type, layerIdx });
    }
  }, [latestPropagation, layerIdx]);

  return (
    <S.Container
      style={{
        opacity: propagations.length > 0 ? 1 : 0,
      }}
    ></S.Container>
  );
}

async function simpleTone({ propagationState, layerIdx }) {
  // Ensure Tone.js context is started
  await Tone.start();

  // Create a basic synth with the desired envelope settings and connect it to the main output (speakers)
  const synth = new Tone.PolySynth().toDestination();

  const now = Tone.now();

  // notes: all note from C2 to C3
  const NOTES = ["C5", "E5", "G5", "B5", "C6"];

  if (propagationState === "propagation") {
    synth.triggerAttackRelease(NOTES[layerIdx % NOTES.length], "8n", now);
  } else {
    synth.triggerAttackRelease(NOTES[layerIdx % NOTES.length], "8n", now);
  }
}
