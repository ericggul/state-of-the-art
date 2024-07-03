"use client";

import { useState } from "react";
import * as S from "./styles";

import useSocket from "@/utils/socket/useSocketScreen";
import Intro from "@/components/screen/Intro";
import Main from "@/components/screen/Main";
import Propagation from "@/components/screen/Propagation";

export default function Screen({ layerIdx }) {
  const [pageState, setPageState] = useState("intro");

  const [layerClicked, setLayerclicked] = useState(false);

  const socket = useSocket({
    layerIdx,
    handleNewMobile,
    handleNewLayerClicked,
    handleNewPropagation,
  });

  function handleNewMobile(data) {
    console.log("new mobile", data);
    setPageState("main");
  }

  function handleNewLayerClicked(data) {
    console.log("new layer clicked", data);
    setLayerclicked(data.layerVal);
  }

  function handleNewPropagation(data) {
    console.log("new propagation", data);
  }

  return (
    <>
      {pageState === "intro" && <Intro layerIdx={layerIdx} />}
      {pageState === "main" && <Main layerIdx={layerIdx} layerClicked={layerClicked} />}
      {pageState === "propagation" && <Propagation layerIdx={layerIdx} />}
    </>
  );
}
