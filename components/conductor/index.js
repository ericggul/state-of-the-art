"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import handlePropagation from "./propagation";
import useSocket from "@/utils/socket/useSocketConductor";

export default function Conductor() {
  const socket = useSocket({ handleNewMobile, handleNewTraining });
  const timeoutRefs = useRef([]);

  function handleNewMobile(data) {
    console.log("new mobile", data);
  }

  async function handleNewTraining(data) {
    handlePropagation({
      timeoutRefs,
      data,
      socket,
    });

    if (!data.text) return;

    await getGptResponse({ data, socket });
    await getGptEmbeddings({ data, socket });
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return null;
}

async function getGptResponse({ data, socket }) {
  try {
    const response = await axios.post("/api/openai/gpt-4o", {
      text: data.text,
      params: {
        frequency_penalty: parseFloat(data.params.frequency_penalty),
        temperature: parseFloat(data.params.temperature),
      },
    });

    socket.current.emit("conductor-new-response", {
      generatedOutput: response.data,
      mobileId: data.mobileId,
      propagationId: data.propagationId,
      text: data.text,
    });
  } catch (e) {
    console.log(e, "get gpt response error");
  }
}

async function getGptEmbeddings({ data, socket }) {
  try {
    const text = data.text || "";
    const tokens = text.match(/[\w]+|[.,!?]/g);

    let embeddings = {};
    const uniqueTokens = new Set(tokens);

    // Function to fetch embeddings for a token
    const fetchEmbedding = async (token) => {
      if (!embeddings[token]) {
        const res = await axios.post("/api/openai/embeddings", {
          text: token,
          dim: 128,
        });

        embeddings[token] = res.data[0].embedding.map((el) => parseFloat(el.toFixed(6)));
      }
    };

    // Create an array of promises for all unique tokens
    const embeddingPromises = Array.from(uniqueTokens).map(fetchEmbedding);

    // Execute all embedding requests in parallel
    await Promise.all(embeddingPromises);

    console.log(tokens, embeddings);

    socket.current.emit("conductor-new-embeddings", {
      embeddings,
      tokens,
      mobileId: data.mobileId,
      propagationId: data.propagationId,
      text: data.text,
    });
  } catch (e) {
    console.log("embedding error", e);
  }
}
