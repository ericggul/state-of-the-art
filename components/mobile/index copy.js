"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import UI from "@/foundations/mobile";
import Intro from "@/foundations/mobile/intro";
import AccelerometerHandler from "@/foundations/mobile/accelrometer";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useMobileVisibility from "@/utils/hooks/useMobileVisibility";
import { usePersistentState } from "@/foundations/mobile/utils/usePersistentState";
import Loading from "@/foundations/mobile/loading";

export default function Mobile() {
  const [state, setState] = usePersistentState();
  const mobileId = useMemo(() => "DUMMY", []);
  const [isIntro, setIsIntro] = useState(true);

  const handleNewResponse = useCallback((data) => {
    console.log("New response from controller:", data);
  }, []);

  const socket = useSocketMobile({ mobileId, handleNewResponse });
  useMobileVisibility({ socket, mobileId });

  if (state.isLoading) {
    return <Loading customText="Initialising State" />;
  }

  function handleAccelerometerError() {
    setIsIntro(true);
    try {
      socket.current.emit("mobile-new-intro", {
        type: "state_change",
        introState: 1,
      });
    } catch (error) {
      console.error("Error emitting intro state:", error);
    }
  }

  return (
    <>
      <IntroWrapper
        state={state}
        setState={setState}
        socket={socket}
        isIntro={isIntro}
        setIsIntro={setIsIntro}
      />
      {!isIntro && (
        <UI socket={socket} mobileId={mobileId} username={state.username} />
      )}
      <AccelerometerHandler
        socket={socket}
        mobileId={mobileId}
        isAccelerometerActive={state.isAccelerometerActive}
        handleError={handleAccelerometerError}
      />
    </>
  );
}

function IntroWrapper({ state, setState, socket, isIntro, setIsIntro }) {
  const [introState, setIntroState] = useState(() => (state.username ? 1 : 0));

  useEffect(() => {
    try {
      socket.current.emit("mobile-new-intro", {
        type: "state_change",
        introState,
      });
    } catch (error) {
      console.error("Error emitting intro state:", error);
    }
  }, [introState]);

  useEffect(() => {
    console.log("isIntro", isIntro);
  }, [isIntro]);

  const handleAccelerometerActivate = useCallback(
    (value) => {
      setIntroState(2);
      setIsIntro(false);
      setState({
        ...state,
        isAccelerometerActive: value,
      });
    },
    [state, setState, setIsIntro]
  );

  const handleUsernameSubmit = useCallback(
    (username) => {
      setState({
        ...state,
        username,
      });
      setIntroState(1);
    },
    [state, setState]
  );

  useEffect(() => {
    if (state.username && typeof state.isAccelerometerActive !== "undefined") {
      setIsIntro(false);
      setIntroState(2);
    }
  }, [state.username, state.isAccelerometerActive]);

  if (!isIntro) return null;

  return (
    <Intro
      socket={socket}
      onAccelerometerActivate={handleAccelerometerActivate}
      onUsernameSubmit={handleUsernameSubmit}
      initialUsername={state.username}
      introState={introState}
    />
  );
}
