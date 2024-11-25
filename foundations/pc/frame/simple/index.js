import * as S from "./styles";
import useStore from "@/components/screen/store";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import TextScramble from "./TextScramble";

export default function Frame({ middle = false }) {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const titleRef = useRef(null);
  const verRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    titleWidth: 27,
    verWidth: 2,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());

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
          verWidth: verVw + 1,
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

  const { name, version } = currentArchitectures[0];

  return (
    <S.Container>
      <S.HorizontalLine $width={dimensions} $bottom={bottom} />
      <S.HorizontalLine2 $width={dimensions} $bottom={bottom} />
      {middle && (
        <>
          <S.VerticalLine $top={-10} $left={5} />
          <S.VerticalLine $top={20} $left={7} $height={60} />
          <S.VerticalLine $top={-35} $left={9} />
          <S.VerticalLine $top={-27.5} $left={11} />

          <S.VerticalName $left={5} $top={40}>
            <TextScramble text={name} isAnimating={isAnimating} />
          </S.VerticalName>
          <S.VerticalName $left={7} $top={20}>
            <TextScramble text={name} isAnimating={isAnimating} />
          </S.VerticalName>
          <S.VerticalName $left={9} $top={55}>
            <TextScramble text={version} isAnimating={isAnimating} />
          </S.VerticalName>
        </>
      )}

      <S.ModelTitle ref={titleRef} $width={dimensions} $bottom={bottom}>
        <S.Ver ref={verRef}>
          <TextScramble text={version} isAnimating={isAnimating} />
        </S.Ver>
        <S.Title>
          <TextScramble text={name} isAnimating={isAnimating} />
        </S.Title>
      </S.ModelTitle>
    </S.Container>
  );
}
