import axios from "axios";

import { useState, useEffect } from "react";

export default function useTokenisation({ text }) {
  const [tokenisedArr, setTokenisedArr] = useState([]);
  useEffect(() => {
    const regex = /[\p{L}\p{N}]+|[.,!?]/gu;
    const arr = text.match(regex);
    setTokenisedArr(arr || []); // Ensure to set an empty array if no matches found
  }, [text]);

  return tokenisedArr;
}

export function handleTokenisation(text) {
  const regex = /[\p{L}\p{N}]+|[.,!?]/gu;
  return text.match(regex) || [];
}

function useTokenisationOriginal({ text }) {
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
