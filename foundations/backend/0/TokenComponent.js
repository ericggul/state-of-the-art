import * as S from "./styles";
import { useState, useEffect } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

function animStateConverter(animState, targetDigit) {
  const binary = animState.toString(2);
  const binaryThreeDigits = binary.padStart(3, "0");
  return binaryThreeDigits[targetDigit];
}

export default function TokenComponent({
  token,
  embedding,
  i,
  wordPosCalc,
  isTarget,
  isAnimating,
  subLevel,
  animState,
}) {
  const [displayEmbeddings, setDisplayEmbeddings] = useState({
    pos: [],
    neg: [],
  });
  const [opacity, setOpacity] = useState(Math.random() * 0.2);

  useEffect(() => {
    if (!embedding) return;
    setDisplayEmbeddings({
      pos: embedding.filter((el) => el > 0).slice(0, 25),
      neg: embedding.filter((el) => el < 0).slice(0, 25),
    });
  }, [embedding]);

  useRandomInterval(
    () => {
      if (!embedding || !isAnimating) {
        setOpacity(1);
        return;
      }
      // Only shuffle embeddings if animating
      setDisplayEmbeddings((prev) => ({
        pos: [...prev.pos].sort(() => Math.random() - 0.5),
        neg: [...prev.neg].sort(() => Math.random() - 0.5),
      }));
      setOpacity(subLevel === 2 ? Math.random() : 1);
    },
    1,
    80
  );

  const [x, y] = wordPosCalc(i);

  // Calculate content visibility states
  const BASE_OPACITY = 0.0;
  const containerOpacity = isAnimating ? opacity : 1;
  const upperContentVisibility =
    !isAnimating || subLevel !== 1
      ? 1
      : animStateConverter(animState, 0) == "1"
      ? 1
      : BASE_OPACITY;
  const lowerContentVisibility =
    !isAnimating || subLevel !== 1
      ? 1
      : animStateConverter(animState, 2) == "1"
      ? 1
      : BASE_OPACITY;
  const tokenVisibility =
    subLevel === 0
      ? 0
      : subLevel !== 1 || !isAnimating
      ? 1
      : animStateConverter(animState, 1) == "1"
      ? 1
      : BASE_OPACITY;

  return (
    <S.Token
      startswithspace={token.startsWith(" ") ? "true" : undefined}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        opacity: containerOpacity,
      }}
    >
      <S.Inner style={{ opacity: upperContentVisibility }}>
        {displayEmbeddings.pos.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
      <p
        style={{
          margin: "1vw 0",
          fontSize: "1vw",
          // transition: "opacity 0.1s",
          opacity: tokenVisibility,
        }}
      >
        {token}
      </p>
      <S.Inner style={{ opacity: lowerContentVisibility }}>
        {displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
