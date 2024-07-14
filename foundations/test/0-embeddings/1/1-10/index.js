import * as S from "./styles";
import axios from "axios";
import { useState, useEffect } from "react";
import useTokenisation from "../../useTokenisation";

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
  const [ignitedIndices, setIgnitedIndices] = useState([]);
  const [ignitingRule, setIgnitingRule] = useState(0);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      const interval = setInterval(() => {
        setIgnitingRule((i) => (i + 1) % 10);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [tokens]);

  return (
    <S.Container style={{ ...style }}>
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} ignited={i % ignitingRule === 0} token={token} embedding={embeddings[token]} />)}</S.Tokens>
    </S.Container>
  );
}

function Token({ token, embedding, ignited }) {
  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <S.Inner
        style={{
          opacity: ignited ? 1 : 0.1,
          transition: `opacity ${ignited ? 0.1 : 0.6}s`,
        }}
      >
        {embedding && embedding.pos.join(" ")}
      </S.Inner>
      <p
        style={{
          margin: "1vw 0",
          opacity: ignited ? 1 : 0.1,
          transition: `opacity ${ignited ? 0.01 : 0.3}s`,
        }}
      >
        {token}
      </p>
      <S.Inner
        style={{
          opacity: ignited ? 1 : 0.1,
          transition: `opacity ${ignited ? 0.1 : 0.6}s`,
        }}
      >
        {embedding && embedding.neg.join(" ")}
      </S.Inner>
    </S.Token>
  );
}
