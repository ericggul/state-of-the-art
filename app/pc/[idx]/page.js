"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";

// 컴포넌트 매핑 객체
const COMPONENTS = {
  0: dynamic(() => import("@/foundations/pc/avatar/wrapper")),
  1: dynamic(() => import("@/foundations/pc/dashboard")),
  // 2: dynamic(() => import("@/foundations/pc/2d-vis")),
  // 2: dynamic(() => import("@/components/frontend")),
  2: dynamic(() => import("@/foundations/pc/text")),
  3: dynamic(() => import("@/foundations/pc/rhizome")),

  4: dynamic(() => import("@/foundations/pc/text/index-old")),

  5: dynamic(() => import("@/foundations/pc/grid")),
};

const Backend = dynamic(() => import("@/components/backend"));
const Transition = dynamic(() => import("@/components/screen/transition"));

export default function RelationPage() {
  const { idx } = useParams();

  const {
    mobileVisibility,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
    handleNewMobileArchitecture,
    setIsProjector,
    setDeviceIndex,
  } = useScreenStore();

  // Set isProjector to false on mount
  useEffect(() => {
    setIsProjector(false);
    setDeviceIndex(idx);
  }, [idx]);

  const socket = useSocketScreen({
    layerIdx: idx,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
    handleNewMobileArchitecture,
  });

  const { showFrontend, showBackend, showTransition } = useScreenVisibility({
    mobileVisibility,
  });

  // 동적으로 컴포넌트 선택
  const FrontendComponent = COMPONENTS[idx] || (() => <div>Not Found</div>);

  return (
    <>
      {showFrontend && <FrontendComponent />}
      {showBackend && <Backend showBackend={showBackend} />}
      {showTransition && <Transition />}
    </>
  );
}
