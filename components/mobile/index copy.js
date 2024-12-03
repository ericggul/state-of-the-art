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

  const [isIntro, setIsIntro] = useState(true);
  const [introState, setIntroState] = useState(state.username ? 1 : 0);

  const handleNewResponse = useCallback((data) => {
    console.log("New response from controller:", data);
  }, []);

  const handleMobileIdGenerated = useCallback(
    (newMobileId) => {
      setState((prev) => ({
        ...prev,
        mobileId: newMobileId,
      }));
    },
    [setState]
  );

  console.log("state.mobileId", state.mobileId);

  const { socket, mobileId } = useSocketMobile({
    mobileId: state.mobileId,
    handleNewResponse,
    onMobileIdGenerated: handleMobileIdGenerated,
  });
  useMobileVisibility({ socket, mobileId: state.mobileId });

  if (state.isLoading) {
    return <Loading customText="Initialising State" />;
  }

  function handleAccelerometerError() {
    setIsIntro(true);
    setIntroState(1);
    console.log("32");
    try {
      socket.current.emit("mobile-new-intro", {
        type: "state_change",
        introState: 1,
        mobileId: state.mobileId,
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
        introState={introState}
        setIntroState={setIntroState}
      />
      {!isIntro && (
        <UI
          socket={socket}
          mobileId={state.mobileId}
          username={state.username}
        />
      )}
      <AccelerometerHandler
        socket={socket}
        mobileId={state.mobileId}
        isAccelerometerActive={state.isAccelerometerActive}
        handleError={handleAccelerometerError}
      />
    </>
  );
}

function IntroWrapper({
  state,
  setState,
  socket,
  isIntro,
  setIsIntro,
  introState,
  setIntroState,
}) {
  useEffect(() => {
    try {
      socket.current.emit("mobile-new-intro", {
        type: "state_change",
        introState,
        mobileId: state.mobileId,
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
      mobileId={state.mobileId}
      introState={introState}
    />
  );
}
