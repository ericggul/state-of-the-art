"use client";

import { useState } from "react";
import * as S from "./styles";

import useSocket from "@/utils/socket/useSocketScreen";
import Intro from "@/components/screen/Intro";
import Main from "@/components/screen/Main";
import Propagation from "@/components/screen/Propagation";

export default function Screen({ layerIdx }) {
  const [pageState, setPageState] = useState("intro");

  const [layerExpanded, setLayerExpanded] = useState(false);
  const [propagatedState, setPropagatedState] = useState("idle");

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
    setPageState("main");
    setLayerExpanded(data.layerVal);
  }

  function handleNewPropagation(data) {
    console.log("new propagation", data);
    setPageState("main");
    setPropagatedState(data.type);
  }

  console.log(pageState, "page state");

  return (
    <>
      {pageState === "intro" && <Intro layerIdx={layerIdx} />}
      {pageState === "main" && <Main layerIdx={layerIdx} layerExpanded={layerExpanded} />}
      {pageState === "main" && <Propagation layerIdx={layerIdx} propagatedState={propagatedState} setPropagatedState={setPropagatedState} />}
    </>
  );
}
