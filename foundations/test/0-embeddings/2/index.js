import * as S from "./styles";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

import useTokenisation from "../../../../utils/hooks/useTokenisation";

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
      let res = await axios.post("/api/openai/embeddings", {
        text,
        dim: 256,
      });

      setEmbeddings((embd) => {
        let copy = { ...embd };
        let newRes = res.data[0].embedding.map((el) => parseFloat(el.toFixed(3)));
        copy[text] = newRes;
        return copy;
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <S.Container>
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} token={token} embedding={embeddings[token]} />)}</S.Tokens>
      <S.Overlay ispos={"true"} />
      {/* <S.Overlay ispos={""} /> */}
    </S.Container>
  );
}

function Token({ token, embedding }) {
  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <p>{token}</p>
      {embedding && (
        <>
          <S.Vector ispos={"true"}>
            <S.Inner>{embedding.join(" ")}</S.Inner>
          </S.Vector>
        </>
      )}
    </S.Token>
  );
}
