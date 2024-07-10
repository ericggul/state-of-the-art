import * as S from "./styles";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

export default function Layer0({ tokens }) {
  const [embeddings, setEmbeddings] = useState({});

  useEffect(() => {
    tokens.forEach((token) => {
      if (!embeddings[token]) {
        fetchEmbedding(token);
      }
    });
  }, [tokens]);

  async function fetchEmbedding(text) {
    if (!text) return;
    let res = await axios.post("/api/openai/embeddings", {
      text,
      dim: 256,
    });

    setEmbeddings((embd) => {
      let copy = { ...embd };
      let newRes = res.data[0].embedding.map((el) => parseFloat(el.toFixed(2)));
      copy[text] = {
        pos: newRes
          .filter((a) => a > 0)
          .sort((a, b) => b - a)
          .slice(0, 50),
        neg: newRes
          .filter((a) => a < 0)
          .sort((a, b) => b - a)
          .slice(0, 50),
      };
      return copy;
    });
  }

  return (
    <S.Container>
      <S.Tokens>
        {tokens.map((token, i) => (
          <Token key={i} token={token} embedding={embeddings[token]} />
        ))}
      </S.Tokens>
      <S.Overlay isPos={true} />
      <S.Overlay isPos={false} />
    </S.Container>
  );
}

function Token({ token, embedding }) {
  return (
    <S.Token startswithspace={token.startsWith(" ")}>
      {token}
      {embedding && (
        <>
          <S.Vector isPos={true}>
            <S.Inner>{embedding.pos.join(" ")}</S.Inner>
          </S.Vector>
          <S.Vector isPos={false}>
            <S.Inner>{embedding.neg.join(" ")}</S.Inner>
          </S.Vector>
        </>
      )}
    </S.Token>
  );
}
