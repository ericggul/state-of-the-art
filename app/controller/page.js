"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";
import useInactivityCheck from "@/utils/hooks/useInactivityCheck";
import useAutoReset from "@/components/controller/utils/useAutoReset";

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
  });

  useScreenVisibility();
  useInactivityCheck();

  return (
    <Suspense>
      <Controller socket={socket} />
    </Suspense>
  );
}
