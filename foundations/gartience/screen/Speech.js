import React, { useState, useEffect, Suspense } from "react";
import * as S from "./styles";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const Speech = React.memo(function Speech({ text, en, hasQR }) {
  const [displayedTextKo, setDisplayedTextKo] = useState("");
  const [displayedTextEn, setDisplayedTextEn] = useState("");
  const [currentIndexKo, setCurrentIndexKo] = useState(0);
  const [currentIndexEn, setCurrentIndexEn] = useState(0);

  // Reset when text changes
  useEffect(() => {
    setDisplayedTextKo("");
    setDisplayedTextEn("");
    setCurrentIndexKo(0);
    setCurrentIndexEn(0);
  }, [text, en]);

  // Korean text typing effect (original speed)
  useRandomInterval(
    () => {
      if (currentIndexKo < text.length) {
        setDisplayedTextKo((prev) => prev + text[currentIndexKo]);
        setCurrentIndexKo((prev) => prev + 1);
      }
    },
    20,
    80,
    currentIndexKo < text.length
  );

  // English text typing effect (faster)
  useRandomInterval(
    () => {
      if (currentIndexEn < en.length) {
        // Type up to 2 characters at once for faster appearance
        const charsToAdd = Math.min(2, en.length - currentIndexEn);
        setDisplayedTextEn(
          (prev) => prev + en.slice(currentIndexEn, currentIndexEn + charsToAdd)
        );
        setCurrentIndexEn((prev) => prev + charsToAdd);
      }
    },
    10, // Faster min delay
    80, // Faster max delay
    currentIndexEn < en.length
  );

  return (
    <Suspense fallback={<div />}>
      <S.SpeechContainer $hasQR={hasQR}>
        <S.SpeechText $hasQR={hasQR}>
          {displayedTextKo}
          {currentIndexKo < text.length && <S.Cursor />}
        </S.SpeechText>
        <S.SpeechTextEn $hasQR={hasQR}>
          {displayedTextEn}
          {currentIndexEn < en.length && <S.Cursor />}
        </S.SpeechTextEn>
      </S.SpeechContainer>
    </Suspense>
  );
});

export default Speech;
