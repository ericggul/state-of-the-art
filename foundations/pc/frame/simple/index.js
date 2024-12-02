import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import TextScramble from "../../utils/TextScramble";
import useDebounce from "@/utils/hooks/useDebounce";

export default function Frame({ middle = false }) {
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

  const bottom = middle ? 20 : 3;

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

        const { name, version } = currentArchitectures[0];
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

  const { name, version } = currentArchitectures[0];

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
      {middle && (
        <>
          {[
            { top: -10, left: 5, height: 100, index: 0 },
            { top: 20, left: 7, height: 60, index: 1 },
            { top: -35, left: 9, height: 100, index: 2 },
            { top: -27.5, left: 11, height: 100, index: 3 },
          ].map(({ top, left, height, index }) => (
            <S.VerticalLine
              key={`line-${index}-${lineKey}`}
              $hue={debouncedHue}
              $top={top}
              $left={left}
              $height={height}
              $index={index}
              $isAnimating={isAnimating}
            />
          ))}

          <S.VerticalName $hue={debouncedHue} $left={5} $top={40}>
            <TextScramble text={name} />
          </S.VerticalName>
          <S.VerticalName $hue={debouncedHue} $left={7} $top={20}>
            <TextScramble text={name} />
          </S.VerticalName>
          <S.VerticalName $hue={debouncedHue} $left={9} $top={55}>
            <TextScramble text={version} />
          </S.VerticalName>
        </>
      )}

      <S.ModelTitle
        $hue={debouncedHue}
        ref={titleRef}
        $width={dimensions}
        $bottom={bottom}
      >
        <S.Ver ref={verRef}>
          <TextScramble text={version} />
        </S.Ver>
        <S.Title>
          <TextScramble text={name} />
        </S.Title>
      </S.ModelTitle>
    </S.Container>
  );
}
