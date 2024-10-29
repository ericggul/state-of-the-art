import React, { useMemo, useEffect, useRef } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import { OBJECT_ARRAY } from "@/components/controller/constant/models/v3";
import * as Tone from "tone";

export default function Grid() {
  const { currentArchitectures } = useScreenStore();
  const synthRef = useRef(null);

  const highlightedVersions = useMemo(() => {
    return currentArchitectures.map((arch) => arch.version);
  }, [currentArchitectures]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = new Tone.MembraneSynth().toDestination();
      synthRef.current.volume.value = -5;
    }

    return () => {
      if (synthRef.current) synthRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (synthRef.current) {
      try {
        synthRef.current.triggerAttackRelease("C3", "16n");
      } catch (e) {
        console.error("Error playing sound:", e);
      }
    }
  }, [highlightedVersions]);

  return (
    <S.Container>
      <S.GridWrapper>
        {OBJECT_ARRAY.map((model) => (
          <S.GridItem
            key={model.version}
            $isHighlighted={highlightedVersions.includes(model.version)}
          >
            <S.ModelName>{model.name}</S.ModelName>
            <S.ModelVersion>{model.version}</S.ModelVersion>
          </S.GridItem>
        ))}
      </S.GridWrapper>
    </S.Container>
  );
}
