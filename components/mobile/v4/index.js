"use client";

import { useCallback, useMemo } from "react";
import UI from "@/foundations/mobile/v4";
import Intro from "@/foundations/mobile/v4/intro";
import AccelerometerHandler from "@/foundations/mobile/v4/accelrometer";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useMobileVisibility from "@/utils/hooks/useMobileVisibility";
import { usePersistentState } from "@/foundations/mobile/v4/utils/usePersistentState";

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

  const handleAccelerometerActivate = useCallback(
    (value) => {
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

  if (state.isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <>
      {!state.isAccelerometerActive && (
        <Intro
          socket={socket}
          onAccelerometerActivate={handleAccelerometerActivate}
          onUsernameSubmit={handleUsernameSubmit}
          initialUsername={state.username}
        />
      )}
      {state.isAccelerometerActive && (
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
