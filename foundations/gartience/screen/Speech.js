import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const Speech = React.memo(function Speech({ text }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useRandomInterval(
    () => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }
    },
    20, // Min delay between characters (ms)
    80, // Max delay between characters (ms)
    currentIndex < text.length // Only active while there are characters left
  );

  return (
    <S.SpeechText>
      {displayedText}
      <S.Cursor />
    </S.SpeechText>
  );
});

export default Speech;
