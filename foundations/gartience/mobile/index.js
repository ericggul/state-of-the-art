import React from "react";
import * as S from "./styles";
import useSocketMobile from "@/utils/socket/gartience/useSocketMobile";
import useMobileStore from "./store";

import Chaos from "./chaos";
import ThreeScene from "./3d";

export default function Mobile() {
  const { state, setState, setChaos, setArchitectures } = useMobileStore();

  const socket = useSocketMobile({
    handleNewState: setState,
    handleNewChaos: () => setChaos(true),
    handleNewArchitectures: setArchitectures,
  });
  console.log(state);

  return (
    <S.Container>
      <ThreeScene />
    </S.Container>
  );
}
