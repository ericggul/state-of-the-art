import * as S from "./styles";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

import useTokenisation from "../useTokenisation";

export default function Layer0({ text }) {
  const tokens = useTokenisation({ text: text || "" });

  console.log("10 layer 0");
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
    console.log(text, "24");
    let res = await axios.post("/api/openai/embeddings", {
      text,
      dim: 256,
    });
    console.log(res, "29");

    setEmbeddings((embd) => {
      let copy = { ...embd };
      let newRes = res.data[0].embedding.map((el) => parseFloat(el.toFixed(3)));
      copy[text] = {
        pos: newRes
          .filter((a) => a > 0)
          .sort((a, b) => b - a)
          .slice(0, 50),
        neg: newRes
          .filter((a) => a < 0)
          .sort((a, b) => a - b)
          .slice(0, 50)
          .reverse(),
      };
      return copy;
    });
  }

  return (
    <S.Container>
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} token={token} embedding={embeddings[token]} />)}</S.Tokens>
      <S.Overlay ispos={"true"} />
      <S.Overlay ispos={""} />
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
            <S.Inner>{embedding.pos.join(" ")}</S.Inner>
          </S.Vector>
          <S.Vector ispos={""}>
            <S.Inner>{embedding.neg.join(" ")}</S.Inner>
          </S.Vector>
        </>
      )}
    </S.Token>
  );
}
