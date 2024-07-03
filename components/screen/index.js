"use client";

import { useState } from "react";
import * as S from "./styles";

import useSocket from "@/utils/hooks/socket/useSocketScreen";
import Intro from "@/foundations/screen/Intro";
import Main from "@/foundations/screen/Main";
import Propagation from "@/foundations/screen/Propagation";

// Define the different states and their corresponding components
const PAGES = {
  intro: Intro,
  main: Main,
  propagation: Propagation,
};

export default function Screen({ layerIdx }) {
  const [pageState, setPageState] = useState("intro");

  const socket = useSocket({
    handleNewMobile,
    handleNewLayerClicked,
    handleNewPropagation,
  });

  function handleNewMobile(data) {
    console.log("new mobile", data);
  }

  function handleNewLayerClicked(data) {
    console.log("new layer clicked", data);
  }

  function handleNewPropagation(data) {
    console.log("new propagation", data);
  }

  // Get the Component corresponding to the current state
  const CurrentPageComponent = PAGES[pageState];

  return <CurrentPageComponent layerIdx={layerIdx} />;
}
