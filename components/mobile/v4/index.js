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
    },
    [state, setState]
  );

  console.log("state", state);

  useEffect(() => {
    if (state.username && typeof state.isAccelerometerActive !== "undefined") {
      setIsIntro(false);
    }
  }, [state.username, state.isAccelerometerActive]);

  if (state.isLoading) {
    return <Loading customText="Initializing State" />;
  }

  return (
    <>
      {isIntro && (
        <Intro
          socket={socket}
          onAccelerometerActivate={handleAccelerometerActivate}
          onUsernameSubmit={handleUsernameSubmit}
          initialUsername={state.username}
        />
      )}
      {!isIntro && (
        <UI socket={socket} mobileId={mobileId} username={state.username} />
      )}
      <AccelerometerHandler
        socket={socket}
        mobileId={mobileId}
        isAccelerometerActive={state.isAccelerometerActive}
      />
    </>
  );
}
