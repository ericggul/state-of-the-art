"use client";

import { useEffect, useMemo, useCallback } from "react";
import MobileEl from "@/foundations/mobile/v2/wrapper";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useVisibilityCheck from "@/utils/hooks/useVisibilityCheck";

import { v4 as uuidv4 } from "uuid";

export default function Mobile() {
  const mobileId = useMemo(() => uuidv4(), []);

  const handleNewResponse = useCallback((data) => {
    console.log("New response from controller:", data);
  }, []);

  const socket = useSocketMobile({
    mobileId,
    handleNewResponse,
  });

  const isVisible = useVisibilityCheck({ socket, mobileId });

  return <MobileEl mobileId={mobileId} socket={socket} />;
}
