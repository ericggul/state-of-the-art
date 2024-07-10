import { useEffect } from "react";
import * as S from "./styles";
import * as Tone from "tone";

export default function Main({ layerIdx, layerExpanded }) {
  //simple audio effect
  useEffect(() => {
    simpleTone(layerExpanded);
  }, [layerExpanded]);

  return (
    <S.Container>
      Main
      <p
        style={{
          opacity: layerExpanded ? 1 : 0,
        }}
      >
        This layer is a convolution layer.
        <br />
        This layer is currently expanded.
      </p>
    </S.Container>
  );
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
