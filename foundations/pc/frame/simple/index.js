import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import TextScramble from "../../utils/TextScramble";
import useDebounce from "@/utils/hooks/useDebounce";
import { getModelTypeName } from "@/utils/constant/modelTypes";

export default function Frame() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const keyHue = currentArchitectures?.[0]?.hue ?? 230;
  const debouncedHue = useDebounce(keyHue, 100);

  const titleRef = useRef(null);
  const verRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    titleWidth: 27,
    verWidth: 2,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const [lineKey, setLineKey] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);

  const bottom = 6;

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const title = titleRef.current;
      const ver = verRef.current;

      if (title && ver && currentArchitectures?.length > 0) {
        const vw = window.innerWidth / 100;
        const tempTitle = document.createElement("span");
        const tempVer = document.createElement("span");

        const titleStyles = window.getComputedStyle(title);
        const verStyles = window.getComputedStyle(ver);

        Object.assign(tempTitle.style, {
          fontSize: titleStyles.fontSize,
          fontFamily: titleStyles.fontFamily,
          visibility: "hidden",
          position: "absolute",
          whiteSpace: "nowrap",
        });
        Object.assign(tempVer.style, {
          fontSize: verStyles.fontSize,
          fontFamily: verStyles.fontFamily,
          visibility: "hidden",
          position: "absolute",
          whiteSpace: "nowrap",
        });

        const { name, version, type } = currentArchitectures[0];
        tempTitle.textContent = name;
        tempVer.textContent = version;

        document.body.appendChild(tempTitle);
        document.body.appendChild(tempVer);

        const titleVw = tempTitle.getBoundingClientRect().width / vw;
        const verVw = tempVer.getBoundingClientRect().width / vw;

        document.body.removeChild(tempTitle);
        document.body.removeChild(tempVer);

        setDimensions({
          titleWidth: titleVw + 2,
          verWidth: verVw,
        });
      }
    };

    updateDimensions();
  }, [currentArchitectures]);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (timeSinceLastUpdate < 100) {
      setIsAnimating(false);
      return;
    }

    setShouldRender(false);
    requestAnimationFrame(() => {
      setShouldRender(true);
      setIsAnimating(true);
      setLineKey((prev) => prev + 1);
    });

    lastUpdateRef.current = now;

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

  if (!currentArchitectures?.length || !shouldRender) return null;

  const { name, version, category } = currentArchitectures[0];
  const modelType = getModelTypeName(category);

  return (
    <S.Container>
      <S.HorizontalLine
        $hue={debouncedHue}
        $width={dimensions}
        $bottom={bottom}
      />
      <S.HorizontalLine2
        $hue={debouncedHue}
        $width={dimensions}
        $bottom={bottom}
      />

      <S.ModelTitle
        $hue={debouncedHue}
        ref={titleRef}
        $width={dimensions}
        $bottom={bottom}
      >
        <S.Ver ref={verRef}>
          <TextScramble text={version} />
        </S.Ver>
        <S.ModelType $width={dimensions}>
          <TextScramble text={modelType} />
        </S.ModelType>
        <S.Title>
          <TextScramble text={name} />
        </S.Title>
      </S.ModelTitle>
    </S.Container>
  );
}
