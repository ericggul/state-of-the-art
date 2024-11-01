import * as S from "./styles";
import { useState, useEffect, useMemo } from "react";

export default function TokenComponent({
  token,
  embedding,
  isTarget,
  i,
  wordPosCalc,
  isAnimating,
  animInterval,
  subLevel,
}) {
  const [displayEmbeddings, setDisplayEmbeddings] = useState({
    pos: [],
    neg: [],
  });

  const [x, y] = useMemo(() => wordPosCalc(i), [wordPosCalc, i]);

  const fullOpacity = subLevel === 0 ? 0.7 : subLevel === 1 ? 0.5 : 0.3;

  const opacity = !isAnimating ? fullOpacity : isTarget ? 1 : 0.1;

  useEffect(() => {
    if (!embedding) return;

    setDisplayEmbeddings({
      pos: embedding.filter((el) => el > 0).slice(0, 25),
      neg: embedding.filter((el) => el < 0).slice(0, 25),
    });
  }, [embedding]);

  // useRandomInterval(
  //   () => {
  //     if (embedding) {
  //       setDisplayEmbeddings((prev) => ({
  //         pos: [...prev.pos].sort(() => Math.random() - 0.5),
  //         neg: [...prev.neg].sort(() => Math.random() - 0.5),
  //       }));
  //     }
  //   },
  //   1,
  //   50
  // );

  return (
    <S.Token
      startswithspace={token.startsWith(" ") ? "true" : undefined}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <S.Inner style={{ opacity }} $animInterval={animInterval}>
        {displayEmbeddings.pos.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
      <p
        style={{
          margin: "1vw 0",
          fontSize: "1vw",
        }}
      >
        {token}
      </p>
      <S.Inner style={{ opacity }} $animInterval={animInterval}>
        {displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
