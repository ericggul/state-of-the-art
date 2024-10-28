"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";

// 컴포넌트 매핑 객체
const COMPONENTS = {
  0: dynamic(() => import("@/foundations/frontend/avatar/wrapper")),
  1: dynamic(() => import("@/foundations/pc/dashboard")),
  2: dynamic(() => import("@/foundations/pc/rhizome/_old")),
  3: dynamic(() => import("@/foundations/pc/2d-vis")),
  4: dynamic(() => import("@/foundations/pc/grid")),
  5: dynamic(() => import("@/foundations/pc/rhizome")),
};

const Backend = dynamic(() => import("@/components/backend"));

export default function RelationPage() {
  const { idx } = useParams();

  const {
    currentArchitectures,
    latestSpeech,
    mobileVisibility,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
    handleNewMobileArchitecture,
  } = useScreenStore();

  const socket = useSocketScreen({
    layerIdx: idx,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
    handleNewMobileArchitecture,
  });

  const { showFrontend, showBackend } = useScreenVisibility({
    mobileVisibility,
  });

  // 동적으로 컴포넌트 선택
  const FrontendComponent = COMPONENTS[idx] || (() => <div>Not Found</div>);

  return (
    <>
      {showFrontend && <FrontendComponent />}
      {showBackend && <Backend showBackend={showBackend} />}
    </>
  );
}
