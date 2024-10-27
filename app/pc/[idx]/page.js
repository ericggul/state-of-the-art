"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";

const AvatarWrapper = dynamic(() =>
  import("@/foundations/frontend/avatar/wrapper")
);

const Backend = dynamic(() => import("@/components/backend"));

export default function RelationPage() {
  const { idx } = useParams();

  ///state mngmt
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

  //Chnl idx 0: Avatar

  return (
    <>
      {idx == "0" && (
        <>
          {showFrontend && <AvatarWrapper />}
          {showBackend && <Backend showBackend={showBackend} />}
        </>
      )}
    </>
  );
}
