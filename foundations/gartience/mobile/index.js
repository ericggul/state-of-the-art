import React, { Component, useState, useCallback } from "react";
import * as S from "./styles";
import useSocketMobile from "@/utils/socket/gartience/useSocketMobile";
import useMobileStore from "./store";

import Intro from "./intro";

import Chaos from "./chaos";
import ThreeScene from "./3d";

export default React.memo(function Mobile() {
  const {
    state,
    chaos,
    setState,
    setChaos,
    setArchitectures,
    username,
    setUsername,
  } = useMobileStore();

  const socket = useSocketMobile({
    handleNewState: setState,
    handleNewChaos: () => setChaos(true),
    handleNewArchitectures: setArchitectures,
  });

  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const [isIntroActive, setIsIntroActive] = useState(true);
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
    [setUsername]
  );

  return (
    <S.Container>
      {!chaos && (
        <>
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
        </>
      )}

      {chaos && <Chaos />}
    </S.Container>
  );
});
