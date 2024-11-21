import React, { Component, useState, useCallback } from "react";
import * as S from "./styles";
import useSocketMobile from "@/utils/socket/gartience/useSocketMobile";
import useMobileStore from "./store";

import Intro from "./intro";

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

  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [username, setUsername] = useState("");
  const [showThreeScene, setShowThreeScene] = useState(false);

  const handleAccelerometerActivate = useCallback(
    (value) => {
      setIsAccelerometerActive(value);
      setIsIntroActive(false);
    },
    [state, setState]
  );

  const handleUsernameSubmit = useCallback(
    (username) => {
      setShowThreeScene(true);
      setUsername(username);
    },
    [state, setState]
  );

  console.log(showThreeScene);

  return (
    <S.Container>
      {showThreeScene && (
        <ThreeScene enableDeviceControls={isAccelerometerActive} />
      )}
      {isIntroActive && (
        <Intro
          socket={socket}
          onAccelerometerActivate={handleAccelerometerActivate}
          onUsernameSubmit={handleUsernameSubmit}
          initialUsername={username}
        />
      )}
    </S.Container>
  );
}
