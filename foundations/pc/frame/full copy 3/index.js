import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useState, useLayoutEffect, useRef } from "react";
import TextScramble from "../../utils/TextScramble";
import useDebounce from "@/utils/hooks/useDebounce";
import { getModelTypeName } from "@/utils/constant/modelTypes";

export default function Frame({ isCondensed = false }) {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const targetHue = currentArchitectures?.[0]?.hue ?? 230;
  const debouncedHue = useDebounce(targetHue, 100);

  const titleRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    titleWidth: 45,
  });

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

  if (!currentArchitectures?.length) return null;
  const { name, category } = currentArchitectures[0];
  const modelType = getModelTypeName(category);

  return (
    <S.Container>
      <S.VerticalLine $hue={debouncedHue} />
      <S.HorizontalLine $hue={debouncedHue} $width={dimensions} />
      {!isCondensed && <S.HorizontalLine2 $hue={debouncedHue} />}

      <S.ModelTitle
        $hue={debouncedHue}
        ref={titleRef}
        $isCondensed={isCondensed}
      >
        <S.Title>
          <TextScramble text={name} />
        </S.Title>
        {!isCondensed && (
          <S.ModelType $hue={debouncedHue}>
            <TextScramble text={modelType} />
          </S.ModelType>
        )}
      </S.ModelTitle>
    </S.Container>
  );
}
