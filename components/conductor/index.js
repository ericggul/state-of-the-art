"use client";

import { useState, useRef, useEffect } from "react";

import axios from "axios";
import handlePropagation from "./propagation";
import useSocket from "@/utils/socket/useSocketConductor";

export default function Conductor() {
  const socket = useSocket({ handleNewMobile, handleNewTraining });

  function handleNewMobile(data) {
    console.log("new mobile", data);
  }

  const timeoutRefs = useRef([]);

  async function handleNewTraining(data) {
    handlePropagation({
      timeoutRefs,
      data,
      socket,
    });

    await getGptResponse(data);
    await getGptEmbeddings(data);
  }

  async function getGptResponse(data) {
    const response = await axios.post("/api/openai/gpt-4o", {
      text: data.text,
      params: {
        frequency_penalty: parseFloat(data.params.frequency_penalty),
        temperature: parseFloat(data.params.temperature),
      },
    });

    console.log("gpt response", response.data);
    socket.current.emit("conductor-new-data", {
      generatedOutput: response.data,
      mobileId: data.mobileId,
      propagationId: data.propagationId,
      text: data.text,
    });
  }

  async function getGptEmbeddings(data) {
    const response = await axios.post("/api/openai/embeddings", {
      text: data.text,
      dim: 256,
    });
    console.log("gpt embedding", response.data);

    socket.current.emit("conductor-new-embeddings", {
      embedding: response.data[0].embedding,
      mobileId: data.mobileId,
      propagationId: data.propagationId,
      text: data.text,
    });
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return null;
}
