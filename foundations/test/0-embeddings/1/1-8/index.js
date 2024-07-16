import * as S from "./styles";
import axios from "axios";
import { useState, useEffect } from "react";
import useTokenisation from "../../../../../utils/hooks/useTokenisation";

const TEXT_A = "Is AI the brightness for the future of humanity? Or is it the darkness?";
const TEXT_B = `No one knows what the future holds. But we can make sure it's bright.`;
const TEXT_C = `The future is bright. The future is AI.`;

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

  return <SingleEl tokens={tokens} embeddings={embeddings} style={style} />;
}

function SingleEl({ tokens, embeddings, style }) {
  const [rotationIdx, setRotationIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationIdx((i) => i + 90);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <S.Container style={{ ...style }}>
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} idx={i - tokens.length / 2} rotationIdx={rotationIdx} token={token} embedding={embeddings[token]} />)}</S.Tokens>
    </S.Container>
  );
}

function Token({ token, embedding, idx, rotationIdx }) {
  return (
    <S.Token
      startswithspace={token.startsWith(" ") ? "true" : ""}
      style={{
        transform: `rotate(${idx * rotationIdx}deg)`,
        transition: "transform 1s",
      }}
    >
      <S.Inner>{embedding && embedding.pos.join(" ")}</S.Inner>
      <p
        style={{
          margin: "1vw 0",
          zIndex: "2",
          textShadow: "0 0 10px white",
          fontSize: "1vw",
        }}
      >
        {token}
      </p>
      <S.Inner>{embedding && embedding.neg.join(" ")}</S.Inner>
    </S.Token>
  );
}
