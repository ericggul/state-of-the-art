"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";
import useInactivityCheck from "@/utils/hooks/useInactivityCheck";
import { checkSessionValidity } from "@/components/controller/utils/sessionCheck";

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
    handleNewControllerSessionIdDecline,
    handleNewScreenConversation,
    setIsProjector,
    setDeviceIndex,
    targetMobileId,
    stage,
    sessionId,
  } = useScreenStore();

  const targetMobileIdRef = useRef(null);
  useEffect(() => {
    targetMobileIdRef.current = targetMobileId;
  }, [targetMobileId]);

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
    handleNewControllerSessionIdDecline,
  });

  useScreenVisibility();
  useInactivityCheck();

  const validityChecked = useRef(false);

  function handleNewMobileSessionIdCheck(data) {
    try {
      console.log("58", data);
      // if (!IS_DEPLOYMENT) return;
      console.log("Checking mobile session ID:", data);
      console.log(targetMobileIdRef.current, "targetMobileIdRef.current");
      console.log(validityChecked.current, "validityChecked.current");

      if (
        data.mobileId == targetMobileIdRef.current &&
        validityChecked.current
      ) {
        console.log("already checked");
        return;
      }

      const result = checkSessionValidity(data.sessionId);
      console.log("session validity", result);

      validityChecked.current = true;
      socket.current?.emit("controller-new-sessionId-decline", {
        decline: !result.isValid,
        mobileId: data.mobileId,
        error: result.error,
      });

      if (!result.isValid) {
        console.log(targetMobileIdRef.current, data.mobileId);
        if (targetMobileIdRef && targetMobileIdRef.current == data.mobileId) {
          socket.current?.emit("controller-force-reset-active-mobile");
          setTimeout(() => window.location.reload(true), 2000);
        }
      }

      return result.isValid;
    } catch (error) {
      console.error("Session check handler error:", error);
    }
  }

  return (
    <Suspense>
      <Controller socket={socket} />
    </Suspense>
  );
}
