"use client";

import { useState, useRef, useEffect } from "react";

import useSocket from "@/utils/socket/useSocketScreen";

import Intro from "./Intro";
import Main from "./Main";
import Propagation from "./Propagation";

export default function Screen({ layerIdx }) {
  const [pageState, setPageState] = useState("intro");

  //OLD VERSION: each layer expanded
  const [layerExpanded, setLayerExpanded] = useState(false);

  //NEW VERSION: all layers expanded
  const [layersExpanded, setLayersExpanded] = useState(new Array(5).fill(false));

  const [propagations, setPropagations] = useState([]);
  const [latestPropagation, setLatestPropagation] = useState({});
  const timeoutRef = useRef([]);

  const socket = useSocket({
    layerIdx,
    handleNewMobile,
    handleNewLayerClicked,
    //
    handleNewPropagation,
    handleNewResponse,
    handleNewEmbeddings,
  });

  function handleNewMobile(data) {
    setPageState("main");
  }

  function handleNewLayerClicked(data) {
    setPageState("main");
    // setLayerExpanded(data.layerVal);
    setLayersExpanded(data.layersExpanded);
  }

  function handleNewPropagation(data) {
    setPageState("main");
    setPropagations((arr) => [...arr, data]);
    setLatestPropagation(data);

    const timeoutId = setTimeout(() => {
      setPropagations((arr) => {
        return arr.filter((propagation) => propagation !== data);
      });
    }, 200);

    timeoutRef.current.push(timeoutId);
  }

  const [newResponse, setNewResponse] = useState({});
  function handleNewResponse(data) {
    setNewResponse(data);
  }

  const [embeddings, setEmbeddings] = useState([]);
  function handleNewEmbeddings(data) {
    console.log(data);
  }

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

  return (
    <>
      {pageState === "intro" && <Intro layerIdx={layerIdx} />}
      {pageState === "main" && <Main layerIdx={layerIdx} layersExpanded={layersExpanded} latestPropagation={latestPropagation} newResponse={newResponse} />}
      {pageState === "main" && <Propagation layerIdx={layerIdx} propagations={propagations} latestPropagation={latestPropagation} setPropagations={setPropagations} />}
    </>
  );
}
