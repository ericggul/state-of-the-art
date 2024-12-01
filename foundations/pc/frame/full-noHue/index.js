import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useState, useEffect, useRef } from "react";
import TextScramble from "../simple/TextScramble";

const KEY_HUE = 200;

export default function Frame() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    // If transitions are too rapid, skip animation
    if (timeSinceLastUpdate < 100) {
      setIsAnimating(false);
      return;
    }

    lastUpdateRef.current = now;
    setIsAnimating(true);

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      animationTimeoutRef.current = null;
    }, 600);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [currentArchitectures]);

  return (
    <S.Container>
      <S.VerticalLine />
      <S.HorizontalLine />
      <S.HorizontalLine2 />

      {currentArchitectures && currentArchitectures.length > 0 && (
        <S.ModelTitle>
          <S.Title>
            <TextScramble
              text={currentArchitectures[0].name}
              isAnimating={isAnimating}
            />
          </S.Title>
        </S.ModelTitle>
      )}
    </S.Container>
  );
}
