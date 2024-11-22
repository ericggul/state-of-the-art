"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";
import useInactivityCheck from "@/utils/hooks/useInactivityCheck";

// Keep all dynamic imports together
const Idle = dynamic(() => import("@/components/screen/idle"));
const Intro = dynamic(() => import("@/components/screen/intro"));
const Frontend = dynamic(() => import("@/components/frontend"));
const Backend = dynamic(() => import("@/components/backend"));
const Transition = dynamic(() => import("@/components/screen/transition"));
const Ending = dynamic(() => import("@/components/screen/ending"));

import * as CONST from "@/utils/constant";

// SearchParams wrapper component
function SearchParamsWrapper({ children }) {
  const searchParams = useSearchParams();
  const test = searchParams.get("test");
  return children(test);
}

export default function ScreenWrapper() {
  return (
    <Suspense>
      <SearchParamsWrapper>
        {(test) => <ScreenContent test={test} />}
      </SearchParamsWrapper>
    </Suspense>
  );
}

// Main content component
function ScreenContent({ test }) {
  const {
    handleNewControllerArchitectures,
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
    handleNewMobileIntro,
    handleNewScreenConversation,
    setIsProjector,
    setDeviceIndex,
    stage,
    isTransition,
    iteration,
    isEnding,
  } = useScreenStore();

  useEffect(() => {
    setIsProjector(true);
    setDeviceIndex(4);
  }, []);

  const socket = useSocketScreen({
    layerIdx: 0,
    handleNewControllerArchitectures,
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
    handleNewMobileIntro,
    handleNewScreenConversation,
  });

  useScreenVisibility();
  useInactivityCheck();

  // Simple render for test mode
  if (test) {
    return (
      <Suspense>
        <Frontend isTesting={true} />
      </Suspense>
    );
  }

  console.log("stage", stage);

  // Full integration render for non-test mode
  return (
    <Suspense>
      {stage === "Frontend" && <Frontend type="projector" />}
      {stage === "Frontend" && <Intro />}
      {stage === "Idle" && (
        <Idle $isFrontend={stage === "Frontend"} type="projector" />
      )}
      {isTransition && <Transition />}
      {(stage === "Backend" || iteration >= CONST.MIX_BACKEND_ITERATION) && (
        <Backend socket={socket} />
      )}
      {isEnding && <Ending />}
    </Suspense>
  );
}
