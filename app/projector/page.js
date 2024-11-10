"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, useRef } from "react";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";

const Idle = dynamic(() => import("@/components/idle"));
const Frontend = dynamic(() => import("@/components/frontend"));
const Backend = dynamic(() => import("@/components/backend"));
const Transition = dynamic(() => import("@/components/screen/transition"));

export default function ScreenWrapper() {
  const {
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
    setIsProjector,
    setDeviceIndex,
    stage,
    isTransition,
  } = useScreenStore();

  useEffect(() => {
    setIsProjector(true);
    setDeviceIndex(4);
  }, []);

  const socket = useSocketScreen({
    layerIdx: 0,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
  });

  useScreenVisibility();

  console.log(stage);

  return (
    <Suspense>
      {stage === "Idle" && <Idle />}
      {stage === "Frontend" && <Frontend />}
      {stage === "Backend" && <Backend />}
      {isTransition && <Transition />}
    </Suspense>
  );
}
