"use client";

import { useState } from "react";
import * as S from "./styles";

import useSocket from "@/utils/hooks/socket/useSocketConductor";

export default function Conductor() {
  const socket = useSocket({ handleNewMobile, handleNewTraining });

  console.log("is conductor!");

  function handleNewMobile(data) {
    console.log("new mobile", data);
  }

  function handleNewTraining(data) {
    console.log("training", data);
  }

  return null;
}
