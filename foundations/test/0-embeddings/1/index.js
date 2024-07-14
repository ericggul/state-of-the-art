import * as S from "./styles";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

export default function Layer0({ text, newEmbeddings = {} }) {
  const [embeddings, setEmbeddings] = useState({});
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (!newEmbeddings || !newEmbeddings.embeddings || !newEmbeddings.tokens) return;
    setTokens(newEmbeddings.tokens);
    const formattedEmbeddings = Object.keys(newEmbeddings.embeddings).reduce((acc, key) => {
      acc[key] = formatEmbeddings(newEmbeddings.embeddings[key]);
      return acc;
    }, {});

    setEmbeddings(formattedEmbeddings);
  }, [newEmbeddings]);

  function formatEmbeddings(embeddings) {
    return {
      pos: embeddings
        .filter((a) => a > 0)
        .sort((a, b) => b - a)
        .slice(0, 50)
        .map((el) => el.toFixed(3)),
      neg: embeddings
        .filter((a) => a < 0)
        .sort((a, b) => a - b)
        .slice(0, 50)
        .reverse()
        .map((el) => el.toFixed(3)),
    };
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
