"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, useRef } from "react";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";

const Frontend = dynamic(() => import("@/components/frontend"));
const Backend = dynamic(() => import("@/components/backend"));
// const Backend = dynamic(() => import("@/foundations/test-backend/3-chaos/2"));

export default function ScreenWrapper() {
  const {
    currentArchitectures,
    latestSpeech,
    mobileVisibility,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
    handleNewMobileArchitecture,
    setIsProjector,
  } = useScreenStore();

  useEffect(() => {
    setIsProjector(true);
  }, []);

  const socket = useSocketScreen({
    layerIdx: 0,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
    handleNewMobileArchitecture,
  });

  const { showFrontend, showBackend } = useScreenVisibility({
    mobileVisibility,
  });

  return (
    <Suspense>
      {showFrontend && <Frontend />}
      {showBackend && <Backend showBackend={showBackend} />}
    </Suspense>
  );
}
