import React from "react";
import * as S from "./styles";
import useSocketMobile from "@/utils/socket/gartience/useSocketMobile";
import useMobileStore from "./store";

export default function Mobile() {
  const { state, setState, setChaos, setArchitectures } = useMobileStore();

  const socket = useSocketMobile({
    handleNewState: setState,
    handleNewChaos: setChaos,
    handleNewArchitectures: setArchitectures,
  });
  console.log(state);

  return <S.Container></S.Container>;
}
