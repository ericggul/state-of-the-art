"use client";

import { useState, useMemo, useCallback } from "react";
import UI from "@/foundations/mobile/v3";
import Intro from "@/foundations/mobile/v3/intro";
import AccelerometerHandler from "@/foundations/mobile/v3/accelrometer";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useVisibilityCheck from "@/utils/hooks/useVisibilityCheck";

export default function Mobile() {
  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const mobileId = useMemo(() => "DUMMY", []);

  const handleNewResponse = useCallback((data) => {
    console.log("New response from controller:", data);
  }, []);

  const socket = useSocketMobile({
    mobileId,
    handleNewResponse,
  });

  const isVisible = useVisibilityCheck({ socket, mobileId });

  return (
    <>
      {!isAccelerometerActive && (
        <Intro onAccelerometerActivate={setIsAccelerometerActive} />
      )}
      {isAccelerometerActive && <UI socket={socket} mobileId={mobileId} />}
      <AccelerometerHandler
        mainSocket={socket}
        mobileId={mobileId}
        isAccelerometerActive={isAccelerometerActive}
      />
    </>
  );
}
