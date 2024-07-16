import * as S from "./styles";
import axios from "axios";
import { useState, useEffect } from "react";
import useTokenisation from "../../../../../utils/hooks/useTokenisation";

export default function Layer0({ text }) {
  const tokens = useTokenisation({ text: text || "" });
  const [embeddings, setEmbeddings] = useState({});

  useEffect(() => {
    if (!tokens) return;
    tokens.forEach((token) => {
      if (!embeddings[token]) {
        fetchEmbedding(token);
      }
    });
  }, [tokens]);

  async function fetchEmbedding(text) {
    if (!text) return;

    try {
      const res = await axios.post("/api/openai/embeddings", {
        text,
        dim: 256,
      });

      setEmbeddings((prevEmbeddings) => {
        const newEmbedding = res.data[0].embedding.map((el) => parseFloat(el.toFixed(3)));
        return {
          ...prevEmbeddings,
          [text]: {
            pos: newEmbedding
              .filter((a) => a > 0)
              .sort((a, b) => b - a)
              .slice(0, 50)
              .map((el) => el.toFixed(3)),
            neg: newEmbedding
              .filter((a) => a < 0)
              .sort((a, b) => a - b)
              .slice(0, 50)
              .reverse()
              .map((el) => el.toFixed(3)),
          },
        };
      });
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
    }
  }

  return (
    <S.Bg>
      {new Array(8).fill(0).map((_, i) => (
        <SingleEl
          key={i}
          tokens={tokens}
          embeddings={embeddings}
          style={{
            transform: `rotate(${i * 90}deg) scale(${1 + i * 0.1})`,
            mixBlendMode: "difference",
          }}
        />
      ))}

      <S.Overlay ispos="true" />
      <S.Overlay ispos="" />
    </S.Bg>
  );
}

function SingleEl({ tokens, embeddings, style }) {
  return (
    <S.Container style={{ ...style }}>
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} token={token} embedding={embeddings[token]} />)}</S.Tokens>
    </S.Container>
  );
}

function Token({ token, embedding }) {
  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <S.Inner>{embedding && embedding.pos.join(" ")}</S.Inner>
      <p
        style={{
          margin: "1vw 0",
        }}
      >
        {token}
      </p>
      <S.Inner>{embedding && embedding.neg.join(" ")}</S.Inner>
    </S.Token>
  );
}
