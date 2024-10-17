"use client";

import { useMemo, useState, useEffect } from "react";
import * as S from "./styles";

import Avatar from "./avatar";
import Architecture from "./architecture";

import useSocketScreen from "@/utils/socket/useSocketScreen";

export default function ScreenFrontend() {
  const socket = useSocketScreen({
    layerIdx: 0,
    handleNewArchitectures,
  });

  const [architecturesArchiving, setArchitecturesArchiving] = useState([]);

  const [currentArchitectures, setCurrentArchitectures] = useState([]);

  function handleNewArchitectures(data) {
    console.log(data);
    try {
      setCurrentArchitectures(data.currentArchitectures);
      setArchitecturesArchiving((arr) => [
        ...arr,
        ...data.currentArchitectures,
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  // console.log(architecturesArchiving);

  const version = useMemo(() => {
    return currentArchitectures.length > 0
      ? currentArchitectures[0].version
      : "v4.2.3.4";
  }, [currentArchitectures]);

  return (
    <>
      <S.Container>
        {/* <Avatar /> */}
        <Architecture version={version} />
      </S.Container>
    </>
  );
}
