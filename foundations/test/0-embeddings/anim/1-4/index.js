import * as S from "./styles";
import axios from "axios";
import { useState, useEffect } from "react";
import useTokenisation from "../../../../../utils/hooks/useTokenisation";

import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const TEXT_A = `"Is AI the brightness for the future of humanity? Or is it the darkness?"`;
const TEXT_B = `No one knows what the future holds. But we can make sure it's bright.`;
const TEXT_C = `The future is bright. The future is AI.`;

export default function WholeLayer({ text = TEXT_A }) {
  return (
    <S.Bg>
      <LayerEl text={text} style={{}} />
    </S.Bg>
  );
}

function LayerEl({ text, style = {} }) {
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
        const newEmbedding = res.data[0].embedding.map((el) => parseFloat(el.toFixed(6)));
        return {
          ...prevEmbeddings,
          [text]: {
            pos: newEmbedding
              .filter((a) => a > 0)
              .sort((a, b) => b - a)
              .slice(0, 20),
            neg: newEmbedding
              .filter((a) => a < 0)
              .sort((a, b) => a - b)
              .slice(0, 20)
              .reverse(),
          },
        };
      });
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
    }
  }

  return <SingleEl tokens={tokens} embeddings={embeddings} style={style} />;
}

function SingleEl({ tokens, embeddings, style }) {
  const [targetWordIdx, setTargetWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % tokens.length);
    }, 400);

    return () => clearInterval(interval);
  }, [tokens.length]);

  return (
    <S.Container style={{ ...style }}>
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} isTarget={targetWordIdx === i} token={token} embedding={embeddings[token]} />)}</S.Tokens>
    </S.Container>
  );
}

function Token({ token, embedding, isTarget }) {
  const [displayEmbeddings, setDisplayEmbeddings] = useState({
    pos: [],
    neg: [],
  });

  useEffect(() => {
    if (embedding) {
      setDisplayEmbeddings({
        pos: embedding.pos,
        neg: embedding.neg,
      });
    }
  }, [embedding]);

  useRandomInterval(
    () => {
      if (embedding && isTarget) {
        setDisplayEmbeddings((prev) => ({
          pos: prev.pos.sort((a, b) => Math.random() - 0.5),
          neg: prev.neg.sort((a, b) => Math.random() - 0.5),
        }));
      }
    },
    1,
    50
  );

  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <S.Inner
        style={{
          opacity: isTarget ? 1 : 0.2,
        }}
      >
        {displayEmbeddings && displayEmbeddings.pos.map((el) => el.toFixed(3)).join(" ")}
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
          opacity: isTarget ? 1 : 0.2,
        }}
      >
        {displayEmbeddings && displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
