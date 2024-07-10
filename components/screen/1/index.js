"use client";

import { useState, useRef, useEffect } from "react";

import useSocket from "@/utils/socket/useSocketScreen";

import Intro from "./Intro";
import Main from "./Main";
import Propagation from "./Propagation";

export default function Screen({ layerIdx }) {
  const [pageState, setPageState] = useState("intro");
  const [layerExpanded, setLayerExpanded] = useState(false);
  const [propagations, setPropagations] = useState([]);
  const timeoutRef = useRef([]);

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
    setPageState("main");
    setPropagations((arr) => [...arr, data]);

    const timeoutId = setTimeout(() => {
      setPropagations((arr) => {
        return arr.filter((propagation) => propagation !== data);
      });
    }, 200);

    timeoutRef.current.push(timeoutId);
  }

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

  return (
    <>
      {pageState === "intro" && <Intro layerIdx={layerIdx} />}
      {pageState === "main" && <Main layerIdx={layerIdx} layerExpanded={layerExpanded} />}
      {pageState === "main" && <Propagation layerIdx={layerIdx} propagations={propagations} setPropagations={setPropagations} />}
    </>
  );
}
