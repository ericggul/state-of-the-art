"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";
import useInactivityCheck from "@/utils/hooks/useInactivityCheck";

import * as CONST from "@/utils/constant";

// Keep all dynamic imports together
const COMPONENTS = {
  0: dynamic(() => import("@/foundations/pc/dashboard")),
  1: dynamic(() => import("@/foundations/pc/avatar")),
  2: dynamic(() => import("@/foundations/pc/text")),
  3: dynamic(() => import("@/foundations/pc/rhizome")),

  frame: dynamic(() => import("@/foundations/pc/frame/full")),
};

const Idle = dynamic(() => import("@/components/screen/idle"));
const Intro = dynamic(() => import("@/components/screen/intro"));
const Backend = dynamic(() => import("@/components/backend"));
const Transition = dynamic(() => import("@/components/screen/transition"));
const Ending = dynamic(() => import("@/components/screen/ending"));

// SearchParams wrapper component
function SearchParamsWrapper({ children }) {
  const searchParams = useSearchParams();
  const test = searchParams.get("test");
  return children(test);
}

export default function RelationPage() {
  const { idx } = useParams();

  return (
    <Suspense>
      <SearchParamsWrapper>
        {(test) => <RelationPageContent idx={idx} test={test} />}
      </SearchParamsWrapper>
    </Suspense>
  );
}

// Main content component
function RelationPageContent({ idx, test }) {
  const {
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
    handleNewMobileIntro,

    handleNewControllerInit,
    handleNewControllerArchitectures,
    handleNewControllerVisibility,
    handleNewControllerStageAndReset,
    handleNewControllerSessionId,
    handleNewControllerSessionIdDecline,

    handleNewScreenConversation,

    setIsProjector,
    setDeviceIndex,
    stage,
    isTransition,
    iteration,
    isEnding,
  } = useScreenStore();

  // Only run effects if not in test mode
  useEffect(() => {
    setIsProjector(false);
    setDeviceIndex(idx);
  }, [idx]);

  const socket = useSocketScreen({
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
    handleNewMobileIntro,
    handleNewControllerInit,
    handleNewControllerArchitectures,
    handleNewControllerVisibility,
    handleNewControllerStageAndReset,
    handleNewControllerSessionId,
    handleNewControllerSessionIdDecline,
    handleNewScreenConversation,
  });

  useScreenVisibility();
  useInactivityCheck();

  const FrontendComponent = COMPONENTS[idx] || (() => <div>Not Found</div>);

  // Simple render for test mode
  if (test) {
    return <FrontendComponent isTesting={true} />;
  }

  // Full integration render for non-test mode
  return (
    <>
      {stage === "Frontend" && <FrontendComponent />}
      {stage === "Frontend" && <Intro />}
      {stage === "Idle" && (
        <Idle $isFrontend={stage === "Frontend"} type="pc" />
      )}
      {isTransition && <Transition />}
      {stage === "Backend" && <Backend socket={socket} />}
      {isEnding && <Ending socket={socket} />}
    </>
  );
}
