import axios from "axios";

import { useState, useEffect } from "react";

export default function useTokenisation({ text }) {
  const [tokens, setTokens] = useState(null);
  useEffect(() => {
    handleTokenisation(text);
  }, [text]);

  async function handleTokenisation(text) {
    if (!text) return;
    const tokens = await axios.post("/api/openai/tokenisation", { text });
    console.log(tokens);
    setTokens(tokens);
  }

  return tokens;
}

function useTokenisationLocally({ text }) {
  const [tokens, setTokens] = useState(null);
  useEffect(() => {
    handleTokenisation(text);
  }, [text]);

  async function handleTokenisation(text) {
    if (!text) return;
    const tokens = await encoding.encode(text);
    console.log(tokens);
    setTokens(tokens);
  }

  return tokens;
}
