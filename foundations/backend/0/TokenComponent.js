import * as S from "./styles";
import { useState, useEffect } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function TokenComponent({
  token,
  embedding,
  i,
  wordPosCalc,
  isTarget,
}) {
  const [displayEmbeddings, setDisplayEmbeddings] = useState({
    pos: [],
    neg: [],
  });

  useEffect(() => {
    if (embedding) {
      setDisplayEmbeddings({
        pos: embedding.filter((el) => el > 0).slice(0, 25),
        neg: embedding.filter((el) => el < 0).slice(0, 25),
      });
    }
  }, [embedding]);

  useRandomInterval(
    () => {
      if (embedding) {
        setDisplayEmbeddings((prev) => ({
          pos: [...prev.pos].sort(() => Math.random() - 0.5),
          neg: [...prev.neg].sort(() => Math.random() - 0.5),
        }));
      }
    },
    10,
    20
  );

  const [x, y] = wordPosCalc(i);

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
      <S.Inner>
        {displayEmbeddings.pos.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
      <p
        style={{
          margin: "1vw 0",
          fontSize: "1vw",
          opacity: isTarget ? 1 : 0.1,
        }}
      >
        {token}
      </p>
      <S.Inner>
        {displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
