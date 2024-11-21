import { useMemo } from "react";
import * as S from "../styles";

export default function AnimatedTitle({ text, baseDelay = 0 }) {
  const letters = useMemo(() => {
    return text.split("").map((letter, index) => ({
      letter,
      delay: baseDelay + index * 0.05, // 0.05s delay between each letter
    }));
  }, [text, baseDelay]);

  return (
    <S.IntroTitle aria-label={text}>
      {letters.map(({ letter, delay }, index) => (
        <S.AnimatedText key={index} $delay={delay}>
          {letter === " " ? "\u00A0" : letter}
        </S.AnimatedText>
      ))}
    </S.IntroTitle>
  );
}
