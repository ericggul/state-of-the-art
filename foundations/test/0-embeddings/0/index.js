import * as S from "./styles";
import axios from "axios";

import { useState, useEffect, useMemo } from "react";
import useResize from "@/utils/hooks/useResize";

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
      dim: 256,
    });

    setEmbeddings((embd) => {
      let copy = { ...embd };
      let newRes = res.data[0].embedding.map((el) => el.toFixed(2));
      copy[text] = newRes;
      return copy;
    });
  }

  const [windowWidth, windowHeight] = useResize();

  return (
    <S.Container>
      <S.Tokens>
        {tokens.map((token, i) => (
          <Token key={i} token={token} embedding={embeddings[token] || null} unitWidth={windowWidth * 0.01} />
        ))}
      </S.Tokens>
    </S.Container>
  );
}

//arr rearra
const CUT = 10;

function Token({ token, embedding, unitWidth }) {
  const sortedPosNegEmbedding = useMemo(() => {
    if (!embedding) return { pos: null, neg: null };

    let pos = [];
    let neg = [];

    embedding.forEach((a) => {
      if (a > 0) {
        pos.push(a);
      } else if (a < 0) {
        neg.push(a);
      }
    });

    pos = pos.sort((a, b) => b - a).slice(0, 50);
    neg = neg.sort((a, b) => b - a).slice(0, 50);

    return { pos, neg };
  }, [embedding]);

  const sortedPosEmbedding = sortedPosNegEmbedding.pos;
  const sortedNegEmbedding = sortedPosNegEmbedding.neg;

  return (
    <S.Token startswithspace={token.startsWith(" ")}>
      {token}
      {/* <S.PosVector>
        <S.Inner>
          {sortedPosEmbedding && sortedPosEmbedding.join(" ")}

          <S.Overlay />
        </S.Inner>
      </S.PosVector>
      <S.NegVector>
        <S.Inner>{sortedNegEmbedding && sortedNegEmbedding.join(" ")}</S.Inner>
      </S.NegVector> */}

      <S.PosVector>
        {sortedPosEmbedding &&
          sortedPosEmbedding.map((num, i) => (
            <S.Num key={i} num={Math.abs(num)}>
              {num}
            </S.Num>
          ))}
      </S.PosVector>
      <S.NegVector>
        {sortedNegEmbedding &&
          sortedNegEmbedding.map((num, i) => (
            <S.Num key={i} num={Math.abs(num)}>
              {num}
            </S.Num>
          ))}
      </S.NegVector>
    </S.Token>
  );
}
