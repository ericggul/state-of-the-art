import axios from "axios";

import { useState, useEffect } from "react";

export default function useTokenisation({ text }) {
  const [tokenisedArr, setTokenisedArr] = useState([]);
  useEffect(() => {
    handleTokenisation(text);
  }, [text]);

  async function handleTokenisation(text) {
    if (!text) return;
    const res = await axios.post("/api/openai/tokenisation", { text });
    setTokenisedArr(res.data.decodedArr);
  }

  return tokenisedArr;
}

function useTokenisationLocally({ text }) {
  const [tokens, setTokens] = useState(null);
  useEffect(() => {
    handleTokenisation(text);
  }, [text]);

  async function handleTokenisation(text) {
    if (!text) return;
    const tokens = await encoding.encode(text);
    setTokens(tokens);
  }

  return tokens;
}
