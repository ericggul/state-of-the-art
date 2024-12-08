import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import TextScramble from "../../utils/TextScramble";
import useDebounce from "@/utils/hooks/useDebounce";
import { getModelTypeName } from "@/utils/constant/modelTypes";

const WIDTH = 2880 / 100;
const HEIGHT = 1800 / 100;

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

      {[
        {
          top: 201 / HEIGHT,
          left: 113 / WIDTH,
          height: 1448 / HEIGHT,
          index: 0,
        },
        {
          top: 444 / HEIGHT,
          left: 347 / WIDTH,
          height: 938 / HEIGHT,
          index: 1,
        },
        {
          top: 1082 / HEIGHT,
          left: 568 / WIDTH,
          height: 197 / HEIGHT,
          index: 2,
        },
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

      {[
        {
          top: 201 / HEIGHT,
          left: 0 / WIDTH,
          width: 113 / WIDTH,
          index: 0,
        },
        {
          top: 444 / HEIGHT,
          left: 0 / WIDTH,
          width: 347 / WIDTH,
          index: 1,
        },
        {
          top: 1082 / HEIGHT,
          left: 0 / WIDTH,
          width: 568 / WIDTH,
          index: 2,
        },
        {
          top: 1277 / HEIGHT,
          left: 0 / WIDTH,
          width: 670 / WIDTH,
          index: 3,
        },
        {
          top: 1375 / HEIGHT,
          left: 0 / WIDTH,
          width: 347 / WIDTH,
          index: 4,
        },
        {
          top: 1644 / HEIGHT,
          left: 0 / WIDTH,
          width: 113 / WIDTH,
          index: 5,
        },
        {
          top: 1277 / HEIGHT,
          left: 710 / WIDTH,
          width: 55 / WIDTH,
          index: 6,
        },
      ].map(({ top, left, width, index }) => (
        <S.HorizontalLineGeneralA
          key={`line-${index}-${lineKey}`}
          $hue={debouncedHue}
          $top={top}
          $left={left}
          $width={width}
          $index={index}
          $isAnimating={isAnimating}
        />
      ))}

      <S.VerticalName
        $hue={debouncedHue}
        $left={170 / WIDTH}
        $top={480 / HEIGHT}
      >
        <TextScramble text={name} />
      </S.VerticalName>
      <S.HorizontalName
        $hue={debouncedHue}
        $left={135 / WIDTH}
        $top={1390 / HEIGHT}
      >
        <TextScramble text={modelType} />
      </S.HorizontalName>
      <S.HorizontalName
        $hue={debouncedHue}
        $left={369 / WIDTH}
        $top={1214 / HEIGHT}
      >
        <TextScramble text={version} />
      </S.HorizontalName>

      <S.ModelTitle
        $hue={debouncedHue}
        ref={titleRef}
        $width={dimensions}
        $bottom={bottom}
      >
        <div style={{ opacity: "0" }}>
          <S.Ver ref={verRef}>
            <TextScramble text={version} />
          </S.Ver>
          <S.ModelType $width={dimensions}>
            <TextScramble text={modelType} />
          </S.ModelType>
        </div>

        <S.Title>
          <TextScramble text={name} />
        </S.Title>
      </S.ModelTitle>

      <S.VerticalLine
        key={`line-${30}-${lineKey}`}
        $hue={debouncedHue}
        $top={0}
        $left={98}
        $height={94}
        $index={0}
        $isAnimating={isAnimating}
      />
      <S.HorizontalLineGeneralB
        $hue={debouncedHue}
        $width={2}
        $bottom={1678 / HEIGHT}
        $right={0}
      />
    </S.Container>
  );
}
