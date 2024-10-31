import React, { useState, useEffect } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import * as S from "./styles";

const TokenComponent = React.memo(function TokenComponent({
  i,
  token,
  embedding,
  wordPosCalc,
  wordInterval,
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
    1000,
    2000
  );

  const [x, y] = wordPosCalc(i);

  return (
    <S.Token
      style={{
        left: x,
        top: y,
        width: wordInterval,
      }}
    >
      <S.Inner style={{ opacity: isTarget ? 1 : 0.1 }}>
        {displayEmbeddings.pos.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
      <p style={{ margin: "1vw 0", fontSize: "1vw" }}>{token}</p>
      <S.Inner style={{ opacity: isTarget ? 1 : 0.1 }}>
        {displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
});

export default TokenComponent;
