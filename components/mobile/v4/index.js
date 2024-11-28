"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import UI from "@/foundations/mobile/v4";
import Intro from "@/foundations/mobile/v4/intro";
import AccelerometerHandler from "@/foundations/mobile/v4/accelrometer";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useMobileVisibility from "@/utils/hooks/useMobileVisibility";
import { usePersistentState } from "@/foundations/mobile/v4/utils/usePersistentState";
import Loading from "@/foundations/mobile/v4/loading";

export default function Mobile() {
  const [state, setState] = usePersistentState();
  const [introState, setIntroState] = useState(() => (state.username ? 1 : 0));
  const mobileId = useMemo(() => "DUMMY", []);

  const handleNewResponse = useCallback((data) => {
    console.log("New response from controller:", data);
  }, []);

  const socket = useSocketMobile({
    mobileId,
    handleNewResponse,
  });

  const isVisible = useMobileVisibility({ socket, mobileId });
  const [isIntro, setIsIntro] = useState(true);

  const handleAccelerometerActivate = useCallback(
    (value) => {
      setIsIntro(false);
      setState({
        ...state,
        isAccelerometerActive: value,
      });
    },
    [state, setState]
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
    }
  }, [state.username, state.isAccelerometerActive]);

  if (state.isLoading) {
    return <Loading customText="Initialising State" />;
  }

  console.log(introState);

  function handleError(error) {
    setIntroState(1);
    setIsIntro(true);
  }
  return (
    <>
      {isIntro && (
        <Intro
          socket={socket}
          onAccelerometerActivate={handleAccelerometerActivate}
          onUsernameSubmit={handleUsernameSubmit}
          initialUsername={state.username}
          introState={introState}
          setIntroState={setIntroState}
        />
      )}
      {!isIntro && (
        <UI socket={socket} mobileId={mobileId} username={state.username} />
      )}
      <AccelerometerHandler
        socket={socket}
        mobileId={mobileId}
        isAccelerometerActive={state.isAccelerometerActive}
        handleError={handleError}
      />
    </>
  );
}
