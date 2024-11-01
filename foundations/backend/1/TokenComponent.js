import * as S from "./styles";
import { useState, useEffect, useMemo, memo } from "react";

const TokenComponent = memo(function TokenComponent({
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

  const { opacity, tokenStyle } = useMemo(
    () => ({
      opacity: !isAnimating
        ? [0.7, 0.5, 0.3][subLevel] || 0.5
        : isTarget
        ? 1
        : 0.1,
      tokenStyle: {
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      },
    }),
    [isAnimating, subLevel, isTarget, x, y]
  );

  useEffect(() => {
    if (!embedding) return;
    const pos = embedding.filter((el) => el > 0).slice(0, 25);
    const neg = embedding.filter((el) => el < 0).slice(0, 25);
    setDisplayEmbeddings({ pos, neg });
  }, [embedding]);

  const formattedPos = useMemo(
    () => displayEmbeddings.pos.map((el) => el.toFixed(3)).join(" "),
    [displayEmbeddings.pos]
  );

  const formattedNeg = useMemo(
    () => displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" "),
    [displayEmbeddings.neg]
  );

  return (
    <S.Token
      startswithspace={token.startsWith(" ") ? "true" : undefined}
      style={tokenStyle}
    >
      <S.Inner
        style={{ opacity }}
        $animInterval={animInterval}
        $isAnimating={isAnimating}
      >
        {formattedPos}
      </S.Inner>
      <p style={{ margin: "1vw 0", fontSize: "1vw" }}>{token}</p>
      <S.Inner
        style={{ opacity }}
        $animInterval={animInterval}
        $isAnimating={isAnimating}
      >
        {formattedNeg}
      </S.Inner>
    </S.Token>
  );
});

export default TokenComponent;
