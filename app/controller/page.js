"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";
import useInactivityCheck from "@/utils/hooks/useInactivityCheck";
import { checkSessionValidity } from "@/components/controller/utils/sessionCheck";

import { IS_DEPLOYMENT } from "@/utils/constant";

const Controller = dynamic(() => import("@/components/controller"));

export default function ControllerWrapper() {
  const {
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
    handleNewMobileIntro,
    handleNewControllerInit,
    handleNewControllerArchitectures,
    handleNewControllerVisibility,
    handleNewControllerStageAndReset,
    handleNewScreenConversation,
    setIsProjector,
    setDeviceIndex,
    stage,
    sessionId,
  } = useScreenStore();

  useEffect(() => {
    setIsProjector(true);
    setDeviceIndex(4);
  }, []);

  const socket = useSocketScreen({
    isController: true,
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
    handleNewMobileIntro,
    handleNewControllerInit,
    handleNewControllerArchitectures,
    handleNewControllerVisibility,
    handleNewControllerStageAndReset,
    handleNewScreenConversation,
    handleNewMobileSessionIdCheck,
  });

  useScreenVisibility();
  useInactivityCheck();

  function handleNewMobileSessionIdCheck(data) {
    try {
      if (!IS_DEPLOYMENT) return;
      console.log("Checking mobile session ID:", data);

      const result = checkSessionValidity(data.sessionId);
      console.log("session validity", result);

      socket.current?.emit("controller-new-sessionId-decline", {
        decline: !result.isValid,
        mobileId: data.mobileId,
        error: result.error,
      });

      return result.isValid;
    } catch (error) {
      console.error("Session check handler error:", error);
      // socket.current?.emit("controller-new-sessionId-decline", {
      //   decline: true,
      //   mobileId: data.mobileId,
      //   error: "HANDLER_ERROR",
      // });
    }
  }

  return (
    <Suspense>
      <Controller socket={socket} />
    </Suspense>
  );
}
