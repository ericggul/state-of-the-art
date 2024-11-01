import * as S from "./styles";
import { useState, useEffect, useMemo } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const BASE_OPACITY = 0.0;

function getAnimStateValue(binary, digit) {
  return binary[digit] === "1" ? 1 : BASE_OPACITY;
}

function calculateVisibility(isAnimating, subLevel, animState, digit) {
  if (!isAnimating || subLevel !== 1) return 1;
  const binary = animState.toString(2).padStart(3, "0");
  return getAnimStateValue(binary, digit);
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
  const [opacity, setOpacity] = useState(1);
  const [x, y] = useMemo(() => wordPosCalc(i), [wordPosCalc, i]);

  // Initialize embeddings
  useEffect(() => {
    if (!embedding) return;
    const pos = embedding.filter((el) => el > 0).slice(0, 25);
    const neg = embedding.filter((el) => el < 0).slice(0, 25);
    setDisplayEmbeddings({ pos, neg });
  }, [embedding]);

  // Handle animations
  useRandomInterval(
    () => {
      if (!embedding || !isAnimating) {
        setOpacity(1);
        return;
      }

      setDisplayEmbeddings((prev) => ({
        pos: [...prev.pos].sort(() => Math.random() - 0.5),
        neg: [...prev.neg].sort(() => Math.random() - 0.5),
      }));

      if (subLevel === 2) {
        setOpacity((o) => 1 - o);
      }
    },
    1,
    80
  );

  // Memoize visibility calculations
  const visibilityStates = useMemo(
    () => ({
      container: isAnimating ? opacity : 1,
      upper: calculateVisibility(isAnimating, subLevel, animState, 0),
      token:
        subLevel === 0
          ? 0
          : calculateVisibility(isAnimating, subLevel, animState, 1),
      lower: calculateVisibility(isAnimating, subLevel, animState, 2),
    }),
    [isAnimating, subLevel, animState, opacity]
  );

  return (
    <S.Token
      startswithspace={token.startsWith(" ") ? "true" : undefined}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        opacity: visibilityStates.container,
      }}
    >
      <S.Inner style={{ opacity: visibilityStates.upper }}>
        {displayEmbeddings.pos.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
      <p
        style={{
          margin: "1vw 0",
          fontSize: "1vw",
          opacity: visibilityStates.token,
        }}
      >
        {token}
      </p>
      <S.Inner style={{ opacity: visibilityStates.lower }}>
        {displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
