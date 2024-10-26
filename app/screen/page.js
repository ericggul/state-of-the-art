"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, useRef } from "react";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";

const Frontend = dynamic(() => import("@/components/frontend"));
const Backend = dynamic(() => import("@/components/backend"));

export default function ScreenWrapper() {
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
    layerIdx: 0,
    handleNewControllerArchitectures,
    handleNewSpeech,
    handleNewVisibilityChange,
    handleNewMobileArchitecture,
  });
  console.log("mobile", mobileVisibility);

  // useEffect(() => {
  //   console.log("Current architectures:", currentArchitectures);
  //   console.log("Latest speech:", latestSpeech);
  //   console.log("Mobile visibility:", mobileVisibility);
  // }, [currentArchitectures, latestSpeech, mobileVisibility]);

  const { showFrontend, showBackend } = useShowLogic({ mobileVisibility });
  return (
    <Suspense>
      {showFrontend && <Frontend />}
      {showBackend && <Backend showBackend={showBackend} />}
    </Suspense>
  );
}

function useShowLogic({ mobileVisibility }) {
  const [showFrontend, setShowFrontend] = useState(true);
  const [showBackend, setShowBackend] = useState(false);
  const timeoutRef1 = useRef(null);
  const timeoutRef2 = useRef(null);

  useEffect(() => {
    if (mobileVisibility) {
      setShowFrontend(true);
      setShowBackend(false);
    } else {
      timeoutRef1.current = setTimeout(() => {
        setShowBackend(true);
      }, 2000);
      timeoutRef1.current = setTimeout(() => {
        setShowFrontend(false);
      }, 5000);
    }

    return () => {
      if (timeoutRef1.current) {
        clearTimeout(timeoutRef1.current);
      }
      if (timeoutRef2.current) {
        clearTimeout(timeoutRef2.current);
      }
    };
  }, [mobileVisibility]);

  return { showFrontend, showBackend };
}
