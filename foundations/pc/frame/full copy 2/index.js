import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import TextScramble from "../../utils/TextScramble";
import useDebounce from "@/utils/hooks/useDebounce";
import { getModelTypeName } from "@/utils/constant/modelTypes";

export default function Frame() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const targetHue = currentArchitectures?.[0]?.hue ?? 230;
  const debouncedHue = useDebounce(targetHue, 100);

  const titleRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    titleWidth: 45,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const title = titleRef.current;

      if (title && currentArchitectures?.length > 0) {
        const vw = window.innerWidth / 100;
        const tempTitle = document.createElement("span");

        const titleStyles = window.getComputedStyle(title);

        Object.assign(tempTitle.style, {
          fontSize: titleStyles.fontSize,
          fontFamily: titleStyles.fontFamily,
          visibility: "hidden",
          position: "absolute",
          whiteSpace: "nowrap",
        });

        const { name } = currentArchitectures[0];
        tempTitle.textContent = name;

        document.body.appendChild(tempTitle);
        const titleVw = tempTitle.getBoundingClientRect().width / vw;
        document.body.removeChild(tempTitle);

        setDimensions({
          titleWidth: titleVw + 4,
        });
      }
    };

    updateDimensions();
  }, [currentArchitectures]);

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

  if (!currentArchitectures?.length) return null;
  const { name, category } = currentArchitectures[0];
  const modelType = getModelTypeName(category);

  return (
    <S.Container>
      <S.VerticalLine $hue={debouncedHue} />
      <S.HorizontalLine $hue={debouncedHue} $width={dimensions} />
      <S.HorizontalLine2 $hue={debouncedHue} $width={dimensions} />

      <S.ModelTitle $hue={debouncedHue} ref={titleRef}>
        <S.Title>
          <TextScramble text={name} />
        </S.Title>
        <S.ModelType $hue={debouncedHue} $width={dimensions}>
          <TextScramble text={modelType} />
        </S.ModelType>
      </S.ModelTitle>
    </S.Container>
  );
}
