"use client";

import { useState, useRef, useEffect } from "react";
import * as S from "./styles";

import useSocket from "@/utils/socket/useSocketConductor";

const LAYER_NUMBER = 5;
const TRAINING_INTERVAL = 100;

export default function Conductor() {
  const socket = useSocket({ handleNewMobile, handleNewTraining });

  function handleNewMobile(data) {
    console.log("new mobile", data);
  }

  const timeoutRefs = useRef([]);

  function handleNewTraining(data) {
    // PROPAGATION
    for (let i = 0; i < LAYER_NUMBER; i++) {
      const timeout = setTimeout(() => {
        if (socket && socket.current) {
          socket.current.emit("conductor-propagation", {
            layerIdx: i,
            type: "propagation",
            mobileId: data.mobileId,
            propagationId: data.propagationId,
          });
        }
      }, i * TRAINING_INTERVAL);

      timeoutRefs.current.push(timeout);
    }

    // BACK PROPAGATION
    for (let i = 0; i < LAYER_NUMBER; i++) {
      const timeout = setTimeout(() => {
        if (socket && socket.current) {
          socket.current.emit("conductor-propagation", {
            layerIdx: LAYER_NUMBER - 1 - i,
            type: "back-propagation",
            mobileId: data.mobileId,
            propagationId: data.propagationId,
          });
        }
      }, (i + LAYER_NUMBER) * TRAINING_INTERVAL);

      timeoutRefs.current.push(timeout);
    }
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return null;
}
