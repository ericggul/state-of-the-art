import React, { useMemo, useEffect, useRef, useState } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import { OBJECT_ARRAY } from "@/components/controller/constant/models/v3";
import * as Tone from "tone";

export default function Carousel() {
  const { currentArchitectures } = useScreenStore();
  const synthRef = useRef(null);
  const [rotation, setRotation] = useState(0);

  const highlightedVersions = useMemo(() => {
    return currentArchitectures.map((arch) => arch.version);
  }, [currentArchitectures]);

  // Sound effect setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = new Tone.MembraneSynth().toDestination();
      synthRef.current.volume.value = -5;
    }
    return () => {
      if (synthRef.current) synthRef.current.dispose();
    };
  }, []);

  // Play sound on highlight change
  useEffect(() => {
    if (synthRef.current) {
      try {
        synthRef.current.triggerAttackRelease("C3", "16n");
      } catch (e) {
        console.error("Error playing sound:", e);
      }
    }
  }, [highlightedVersions]);

  // Calculate rotation when highlighted items change
  useEffect(() => {
    if (highlightedVersions.length > 0) {
      const highlightedIndex = OBJECT_ARRAY.findIndex(
        (model) => model.version === highlightedVersions[0]
      );
      if (highlightedIndex !== -1) {
        const newRotation = -(highlightedIndex * (360 / OBJECT_ARRAY.length));
        setRotation(newRotation);
      }
    }
  }, [highlightedVersions]);

  // Memoized carousel items for performance
  const carouselItems = useMemo(() => {
    return OBJECT_ARRAY.map((model, index) => {
      const isHighlighted = highlightedVersions.includes(model.version);
      const angle = (index * 360) / OBJECT_ARRAY.length;

      return (
        <S.CarouselItem
          key={model.version}
          $isHighlighted={isHighlighted}
          $angle={angle}
        >
          <S.ModelName $isHighlighted={isHighlighted}>{model.name}</S.ModelName>
          <S.ModelVersion $isHighlighted={isHighlighted}>
            {model.version}
          </S.ModelVersion>
        </S.CarouselItem>
      );
    });
  }, [highlightedVersions]);

  return (
    <S.Container>
      <S.CarouselWrapper $rotation={rotation}>
        {carouselItems}
      </S.CarouselWrapper>
    </S.Container>
  );
}
