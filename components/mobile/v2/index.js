"use client";

import { useEffect, useMemo, useCallback } from "react";
import MobileEl from "@/foundations/mobile/v2/wrapper";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useMobileVisibility from "@/utils/hooks/useMobileVisibility";

export default function Mobile() {
  const mobileId = useMemo(() => "DUMMY", []);

  const handleNewResponse = useCallback((data) => {
    console.log("New response from controller:", data);
  }, []);

  const socket = useSocketMobile({
    mobileId,
    handleNewResponse,
  });

  const isVisible = useMobileVisibility({ socket, mobileId });

  return <MobileEl mobileId={mobileId} socket={socket} />;
}
