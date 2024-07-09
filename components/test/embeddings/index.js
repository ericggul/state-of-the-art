"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef, useMemo } from "react";

import axios from "axios";

export default function Embeddings() {
  const [input, setInput] = useState("");

  const [embeddedTexts, setEmbeddedTexts] = useState([]);
  const [vector, setVector] = useState([]);
  const unitSize = useMemo(() => Math.min(Math.floor(vector.length / embeddedTexts.length), 100), [vector, embeddedTexts]);

  async function fetchData(input) {
    if (!input) return;
    let res = await axios.post("/api/openai/embeddings", {
      text: input,
    });

    setVector(res.data[0].embedding.map((el) => el.toFixed(2)));
    setEmbeddedTexts(input.split(" "));
  }

  function handleSend() {
    setVector([]);
    fetchData(input);
  }

  console.log(vector, unitSize, vector.slice(0 * unitSize, (0 + 1) * unitSize));
  return (
    <S.Container>
      <S.TextInput value={input} onChange={(e) => setInput(e.target.value)} onBlur={handleSend} />

      {embeddedTexts.map((el, i) => (
        <S.Col key={i}>
          <h1>{el}</h1>
          {vector.slice(i * unitSize, (i + 1) * unitSize).map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </S.Col>
      ))}
      {/* <S.InnerSVG>
        {vector.map((el, i) => (
          <text x="0" y={12 * i}>
            {el}
          </text>
        ))}
      </S.InnerSVG> */}
    </S.Container>
  );
}
