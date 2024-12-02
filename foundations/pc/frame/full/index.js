import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useState, useEffect, useRef } from "react";
import TextScramble from "../../utils/TextScramble";

export default function Frame() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());

  // Get hue from currentArchitectures
  // const keyHue = currentArchitectures?.[0]?.hue ?? 230;
  const keyHue = 230;

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
      <S.VerticalLine $hue={keyHue} />
      <S.HorizontalLine $hue={keyHue} />
      <S.HorizontalLine2 $hue={keyHue} />

      {currentArchitectures && currentArchitectures.length > 0 && (
        <S.ModelTitle $hue={keyHue}>
          <S.Title>
            <TextScramble text={currentArchitectures[0].name} />
          </S.Title>
        </S.ModelTitle>
      )}
    </S.Container>
  );
}
