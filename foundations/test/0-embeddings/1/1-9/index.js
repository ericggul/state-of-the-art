import * as S from "./styles";
import axios from "axios";
import { useState, useEffect } from "react";
import useTokenisation from "../../../../../utils/hooks/useTokenisation";

import useRandomInterval from "@/utils/hooks/useRandomInterval";

const TEXT_A = "Is AI the brightness for the future of humanity? Or is it the darkness?";
const TEXT_B = `No one knows what the future holds. But we can make sure it's bright.`;
const TEXT_C = `The future is bright. The future is AI.`;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function WholeLayer() {
  return (
    <S.Bg>
      <LayerEl text={TEXT_A} style={{}} />

      <S.Overlay ispos="true" />
      <S.Overlay ispos="" />
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
        const newEmbedding = res.data[0].embedding.map((el) => parseFloat(el.toFixed(3)));
        return {
          ...prevEmbeddings,
          [text]: {
            pos: newEmbedding
              .filter((a) => a > 0)
              .sort((a, b) => b - a)
              .slice(0, 30),
            neg: newEmbedding
              .filter((a) => a < 0)
              .sort((a, b) => a - b)
              .slice(0, 30)
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
  return (
    <S.Container style={{ ...style }}>
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} idx={i - tokens.length / 2} token={token} embedding={embeddings[token]} />)}</S.Tokens>
    </S.Container>
  );
}

function Token({ token, embedding, idx }) {
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
      if (embedding) {
        setDisplayEmbeddings((prev) => ({
          pos: embedding.pos
            .sort((a, b) => Math.random() - 0.5)
            .map((el) => parseFloat(el.toFixed(getRandomInt(3, 5))))
            .slice(0, getRandomInt(20, 30)),
          neg: embedding.neg
            .sort((a, b) => Math.random() - 0.5)
            .map((el) => parseFloat(el.toFixed(getRandomInt(3, 5))))
            .slice(0, getRandomInt(20, 30)),
        }));
      }
    },
    10,
    500
  );

  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <S.Inner>{displayEmbeddings && displayEmbeddings.pos.join(" ")}</S.Inner>
      <p
        style={{
          margin: "1vw 0",
          zIndex: "2",
          transition: "all 0.2s ease-in-out",
        }}
      >
        {token}
      </p>
      <S.Inner>{displayEmbeddings && displayEmbeddings.neg.join(" ")}</S.Inner>
    </S.Token>
  );
}
