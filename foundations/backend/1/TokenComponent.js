import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";
import useComputeSimilarity from "@/foundations/backend/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function Token({ token, embedding, isTarget }) {
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

  // Shuffle embeddings periodically using random interval
  useRandomInterval(
    () => {
      if (embedding) {
        setDisplayEmbeddings((prev) => ({
          pos: [...prev.pos].sort(() => Math.random() - 0.5),
          neg: [...prev.neg].sort(() => Math.random() - 0.5),
        }));
      }
    },
    1000, // Use larger intervals to reduce frequent updates
    2000
  );

  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <S.Inner
        style={{
          opacity: isTarget ? 1 : 0.1,
        }}
      >
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
      <S.Inner
        style={{
          opacity: isTarget ? 1 : 0.1,
        }}
      >
        {displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
