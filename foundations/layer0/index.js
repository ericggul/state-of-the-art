import * as S from "./styles";
import axios from "axios";

import { useState, useEffect } from "react";

export default function Layer0({ tokens }) {
  const [embeddings, setEmbeddings] = useState({});

  useEffect(() => {
    //for those tokens which don't have embeddings, generate embedding
    tokens.forEach((token) => {
      if (!embeddings[token]) {
        fetchEmbedding(token);
      }
    });
  }, [tokens, embeddings]);

  async function fetchEmbedding(text) {
    if (!text) return;
    let res = await axios.post("/api/openai/embeddings", {
      text,
    });

    setEmbeddings((embd) => {
      let copy = { ...embd };
      let newRes = res.data[0].embedding.map((el) => el.toFixed(2));
      copy[text] = newRes;
      return copy;
    });
  }

  console.log(embeddings);

  return (
    <S.Container>
      <S.Tokens>
        {tokens.map((token, i) => (
          <Token key={i} token={token} embedding={embeddings[token] || null} />
        ))}
      </S.Tokens>
    </S.Container>
  );
}

function Token({ token, embedding }) {
  return (
    <S.Token
      style={{
        background: `hsl(0, 100%, 80%)`,
      }}
      startsWithSpace={token.startsWith(" ")}
    >
      {token}
      <S.Vector>{embedding.join(" ")}</S.Vector>
    </S.Token>
  );
}
