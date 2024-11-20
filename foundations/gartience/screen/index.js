import React from "react";
import * as S from "./styles";
import useSocketScreen from "@/utils/socket/gartience/useSocketScreen";
import useScreenStore from "./store";

export default function Screen() {
  const { state, setState, setChaos, setArchitectures, setSpeech } =
    useScreenStore();

  const socket = useSocketScreen({
    handleNewState: setState,
    handleNewChaos: setChaos,
    handleNewArchitectures: setArchitectures,
    handleNewSpeech: setSpeech,
  });

  console.log(state);

  return <S.Container></S.Container>;
}
