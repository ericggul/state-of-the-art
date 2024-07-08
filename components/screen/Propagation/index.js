import * as S from "./styles";
import { useState, useEffect, useRef } from "react";

import useResize from "@/utils/hooks/useResize";
import * as Tone from "tone";

import GridTest from "@/components/test/grid/0";

export default function Propagation({ propagations, setPropagations, layerIdx }) {
  const storedPropagationsRef = useRef([]);

  useEffect(() => {
    // detect if propagations has new element
    const newEl = propagations.find((propagation, idx) => propagation !== storedPropagationsRef.current[idx]);
    console.log(propagations, newEl);

    storedPropagationsRef.current = propagations;

    if (newEl) {
      simpleTone({ propagationState: newEl.type, layerIdx });
    }
  }, [propagations, setPropagations, layerIdx]);

  const [windowWidth, windowHeight] = useResize();

  return (
    <S.Container>
      <GridTest activated={propagations.length > 0} />
    </S.Container>
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
