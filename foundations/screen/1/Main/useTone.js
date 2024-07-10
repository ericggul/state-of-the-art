import { useState, useEffect } from "react";
import * as Tone from "tone";

export default function useTone({ layerExpanded }) {
  //simple audio effect
  useEffect(() => {
    simpleTone(layerExpanded);
  }, [layerExpanded]);
}

async function simpleTone(layerExpanded) {
  // Ensure Tone.js context is started
  await Tone.start();

  // Create a basic synth with the desired envelope settings and connect it to the main output (speakers)
  const synth = new Tone.PolySynth().toDestination();

  const now = Tone.now();
  const NOTES = ["C4", "E4", "G4", "B4"];

  if (layerExpanded) {
    NOTES.forEach((note, i) => {
      synth.triggerAttackRelease(note, "16n", now + i * 0.1);
    });
  } else {
    NOTES.reverse().forEach((note, i) => {
      synth.triggerAttackRelease(note, "16n", now + i * 0.1);
    });
  }
}
