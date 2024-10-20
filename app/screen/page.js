"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";

const Frontend = dynamic(() => import("@/components/frontend"));
const Backend = dynamic(() => import("@/components/backend"));

export default function ScreenWrapper() {
  const {
    currentArchitectures,
    latestSpeech,
    mobileVisibility,
    handleNewArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
  } = useScreenStore();

  const socket = useSocketScreen({
    layerIdx: 0,
    handleNewArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
  });

  useEffect(() => {
    console.log("Current architectures:", currentArchitectures);
    console.log("Latest speech:", latestSpeech);
    console.log("Mobile visibility:", mobileVisibility);
  }, [currentArchitectures, latestSpeech, mobileVisibility]);

  return (
    <Suspense>
      <Frontend />
      {/* Uncomment the following line if you want to use the Backend component */}
      {/* <Backend /> */}
    </Suspense>
  );
}
