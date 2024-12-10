"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import UI from "@/foundations/mobile";
import Intro from "@/foundations/mobile/intro";
import AccelerometerHandler from "@/foundations/mobile/accelrometer";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useMobileVisibility from "@/utils/hooks/useMobileVisibility";
import { usePersistentState } from "@/foundations/mobile/utils/usePersistentState";
import Loading from "@/foundations/mobile/loading";

export default function Mobile({ sessionId }) {
  const [state, setState] = usePersistentState();

  const [isIntro, setIsIntro] = useState(true);
  const [introState, setIntroState] = useState(state.username ? 1 : 0);

  const [isDeclined, setIsDeclined] = useState({ status: false, error: null });

  const handleNewControllerSessionIdDecline = useCallback(
    (data) => {
      if (data.decline && data.mobileId == state.mobileId) {
        setIsDeclined({
          status: true,
          error: data.error,
        });
      }
    },
    [state.mobileId]
  );

  const socket = useSocketMobile({
    mobileId: state.mobileId,
    sessionId,
    handleNewControllerSessionIdDecline,
  });
  useMobileVisibility({ socket, mobileId: state.mobileId });

  if (state.isLoading) {
    return <Loading customText="Initialising State" />;
  }

  if (isDeclined.status) {
    return (
      <Loading customText="Session expired. Please scan QR code again to reconnect" />
    );
  }

  function handleAccelerometerError() {
    setIsIntro(true);
    setIntroState(1);
    try {
      if (!socket.current) return;
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
      if (!socket.current) return;
      socket.current.emit("mobile-new-intro", {
        type: "state_change",
        introState,
        mobileId: state.mobileId,
      });
    } catch (error) {
      console.error("Error emitting intro state:", error);
    }
  }, [introState]);

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
