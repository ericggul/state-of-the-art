"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";

// Keep all dynamic imports together
const COMPONENTS = {
  0: dynamic(() => import("@/foundations/pc/avatar/v1")),
  "0-v1": dynamic(() => import("@/foundations/pc/avatar/v1")),
  "0-v2": dynamic(() => import("@/foundations/pc/avatar/v2")),

  1: dynamic(() => import("@/foundations/pc/dashboard/v2")),
  "1-v1": dynamic(() => import("@/foundations/pc/dashboard/v1")),
  "1-v2": dynamic(() => import("@/foundations/pc/dashboard/v2")),

  2: dynamic(() => import("@/foundations/pc/text")),
  3: dynamic(() => import("@/foundations/pc/rhizome")),
};

const Idle = dynamic(() => import("@/components/screen/idle"));
const Backend = dynamic(() => import("@/components/backend"));
const Transition = dynamic(() => import("@/components/screen/transition"));

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

  // Only run effects if not in test mode
  useEffect(() => {
    setIsProjector(false);
    setDeviceIndex(idx);
  }, [idx]);

  const socket = useSocketScreen({
    layerIdx: idx,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
  });

  useScreenVisibility();

  const FrontendComponent = COMPONENTS[idx] || (() => <div>Not Found</div>);

  // Simple render for test mode
  if (test) {
    return <FrontendComponent isTesting={true} />;
  }

  // Full integration render for non-test mode
  return (
    <>
      {stage === "Frontend" && <FrontendComponent />}
      {(stage === "Idle" || stage === "Frontend") && (
        <Idle $isFrontend={stage === "Frontend"} type="pc" />
      )}
      {stage === "Backend" && <Backend />}
      {isTransition && <Transition />}
    </>
  );
}
