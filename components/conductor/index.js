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

    await getGPT(data.text);
  }

  async function getGPT(text) {
    const response = await axios.post("/api/openai/gpt-4o", {
      text,
    });
    console.log(response.data);
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return null;
}
