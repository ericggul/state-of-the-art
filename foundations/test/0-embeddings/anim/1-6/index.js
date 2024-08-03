import * as S from "./styles";
import axios from "axios";
import { useState, useEffect } from "react";
import useTokenisation from "../../../../../utils/hooks/useTokenisation";

import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import useOpacityInterval from "@/utils/hooks/intervals/useOpacityInterval";

const TEXT_A = `"Is AI the brightness for the future of humanity? Or is it the darkness?"`;
const TEXT_B = `No one knows what the future holds. But we can make sure it's bright.`;
const TEXT_C = `The future is bright. The future is AI.`;

export default function WholeLayer({ text = TEXT_B }) {
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
          [text]: newEmbedding,
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
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} token={token} embedding={embeddings[token]} />)}</S.Tokens>
    </S.Container>
  );
}

const getRandomInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function Token({ token, embedding }) {
  const [displayEmbeddings, setDisplayEmbeddings] = useState([]);

  useEffect(() => {
    if (embedding) {
      setDisplayEmbeddings(embedding.slice(0, 20));
    }
  }, [embedding]);

  const [opacity, setOpacity] = useState(Math.random() * 0.2);

  useRandomInterval(() => setOpacity(Math.random()), 1, 50);

  useRandomInterval(
    () => {
      if (embedding) {
        setDisplayEmbeddings((prev) => prev.sort((a, b) => Math.random() - 0.5));
      }
    },
    1,
    50
  );

  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <S.Inner
        style={{
          opacity,
        }}
      >
        {displayEmbeddings && displayEmbeddings.map((el) => el.toFixed(getRandomInt(3, 6))).join(" ")}
      </S.Inner>
      <p
        style={{
          margin: "1vw 0",
          fontSize: "1vw",
          opacity,
        }}
      >
        {token}
      </p>
      <S.Inner
        style={{
          opacity,
        }}
      >
        {displayEmbeddings && displayEmbeddings.map((el) => el.toFixed(getRandomInt(3, 6))).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
