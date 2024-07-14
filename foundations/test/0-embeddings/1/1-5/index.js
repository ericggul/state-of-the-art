import * as S from "./styles";
import axios from "axios";
import { useState, useEffect } from "react";
import useTokenisation from "../../useTokenisation";

const TEXT_A = "Is AI the brightness for the future of humanity? Or is it the darkness?";
const TEXT_B = `No one knows what the future holds. But we can make sure it's bright.`;
const TEXT_C = `The future is bright. The future is AI.`;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function WholeLayer() {
  const [bgSwap, setBgSwap] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setBgSwap((b) => !b);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <S.Bg>
      <LayerEl text={TEXT_A} style={{}} />

      {/* <S.Overlay ispos="true" />
      <S.Overlay ispos="" /> */}
      {/* <S.Bg
        style={{
          background: "white",
          mixBlendMode: "difference",
          width: "50vw",
          height: "100vh",
          position: "absolute",
          top: "0",
          left: "50vw",
          opacity: bgSwap ? 1 : 0,
        }}
      />
      <S.Bg
        style={{
          background: "white",
          mixBlendMode: "difference",
          width: "50vw",
          height: "100vh",
          position: "absolute",
          top: "0",
          left: "0",
          opacity: !bgSwap ? 1 : 0,
        }}
      /> */}

      <S.Bg
        style={{
          background: "white",
          mixBlendMode: "difference",
          width: "100vw",
          height: "50vh",
          position: "absolute",
          top: "0",
          left: "0",
          opacity: bgSwap ? 1 : 0,
        }}
      />
      <S.Bg
        style={{
          background: "white",
          mixBlendMode: "difference",
          width: "100vw",
          height: "50vh",
          position: "absolute",
          top: "50vh",
          left: "0",
          opacity: !bgSwap ? 1 : 0,
        }}
      />
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
  const [showNumbers, setShowNumbers] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNumbers((b) => !b);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <S.Container style={{ ...style }}>
      <S.Tokens>{tokens && tokens.map((token, i) => <Token key={i} showNumbers={showNumbers} token={token} embedding={embeddings[token]} />)}</S.Tokens>
    </S.Container>
  );
}

function Token({ token, embedding, showNumbers }) {
  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <S.Inner>{embedding && embedding.pos.join(" ")}</S.Inner>
      <p
        style={
          {
            // margin: "1vw 0",
            // fontSize: "1vw",
          }
        }
      >
        {token}
      </p>
      <S.Inner>{embedding && embedding.neg.join(" ")}</S.Inner>
    </S.Token>
  );
}
