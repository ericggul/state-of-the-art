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

  // Define the sound properties based on layerExpanded
  const frequency = layerExpanded ? "C5" : "C4";
  const duration = "8n";
  const envelope = layerExpanded ? { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.2 } : { attack: 0.3, decay: 0.5, sustain: 0.5, release: 0.4 };

  // Create a basic synth with the desired envelope settings and connect it to the main output (speakers)
  const synth = new Tone.PolySynth({ envelope }).toDestination();

  // Play the note
  synth.triggerAttackRelease(frequency, duration);
}
