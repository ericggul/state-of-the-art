import * as S from "./styles";
import { useState, useEffect } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function TokenComponent({
  token,
  embedding,
  i,
  wordPosCalc,
  isTarget,
  isAnimating,
  subLevel,
  showNumbers,
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

      // Only animate opacity for subLevel 2
      setOpacity(subLevel === 2 ? Math.random() : 1);
    },
    1,
    50
  );

  const [x, y] = wordPosCalc(i);

  // Calculate content visibility states
  const containerOpacity = isAnimating ? opacity : 1;
  const contentVisibility =
    !isAnimating || subLevel !== 1 ? 1 : showNumbers ? 0 : 1;
  const tokenVisibility =
    subLevel === 0
      ? 0
      : subLevel !== 1 || !isAnimating
      ? 1
      : showNumbers
      ? 1
      : 0;

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
      <S.Inner style={{ opacity: contentVisibility }}>
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
      <S.Inner style={{ opacity: contentVisibility }}>
        {displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
