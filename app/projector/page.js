"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, useRef } from "react";

import useScreenStore from "@/components/screen/store";
import useSocketScreen from "@/utils/socket/useSocketScreen";
import useScreenVisibility from "@/utils/hooks/useScreenVisibility";

const Idle = dynamic(() => import("@/components/screen/idle"));
const Frontend = dynamic(() => import("@/components/frontend"));
const Backend = dynamic(() => import("@/components/backend"));

const Transition = dynamic(() => import("@/components/screen/transition"));

//?TEST

const TempBackend = dynamic(() =>
  import("@/foundations/test/1-relation/random/2/2-6")
);
import {
  INPUT_EMBEDDINGS,
  OUTPUT_EMBEDDINGS,
  MULTI_LAYERS_EMBEDDINGS,
} from "@/foundations/test/1-relation/utils/constant-conversation";

export default function ScreenWrapper() {
  const {
    handleNewControllerArchitectures,
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
    handleNewMobileArchitecture,
    handleNewMobileVisibility,
    handleNewMobile,
  });

  useScreenVisibility();

  return (
    <Suspense>
      {stage === "Frontend" && <Frontend />}
      {(stage === "Idle" || stage === "Frontend") && (
        <Idle $isFrontend={stage === "Frontend"} type="projector" />
      )}

      {stage === "Backend" && <Backend />}
      {/* {stage === "Backend" && (
        <TempBackend
          newInputEmbeddings={INPUT_EMBEDDINGS}
          newOutputEmbeddings={OUTPUT_EMBEDDINGS}
        />
      )} */}
      {isTransition && <Transition />}
    </Suspense>
  );
}
