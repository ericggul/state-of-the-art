import { get_encoding } from "tiktoken";

import { useState, useEffect } from "react";

const encoding = get_encoding("cl100k_base");

export default function useTokenisation({ text }) {
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
