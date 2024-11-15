import { Suspense, useEffect, useState, useRef, useMemo } from "react";
import useScreenStore from "@/components/screen/store";
import { iterationSpeedMultiplier } from "@/utils/function/iterationSpeedMultiplier";

const TIMEOUT_TRANSITION = 7000;
const TIMEOUT_BACKEND = 9000;

export default function useScreenVisibility() {
  const {
    mobileVisibility,
    isProjector,
    setStage,
    stage,
    setIsTransition,
    iteration,
    isTransition,
  } = useScreenStore();

  const timeoutRef1 = useRef(null);
  const timeoutRef2 = useRef(null);
  const timeoutRef3 = useRef(null);

  const isStageIdle = useMemo(() => stage === "Idle", [stage]);
  useEffect(() => {
    if (isStageIdle) return;
    if (mobileVisibility) {
      setStage("Frontend");
      setIsTransition(false);
    } else {
      setIsTransition(true);
      timeoutRef1.current = setTimeout(() => {
        setIsTransition(false);
      }, TIMEOUT_TRANSITION * iterationSpeedMultiplier(iteration));
      timeoutRef2.current = setTimeout(() => {
        setStage("Backend");
      }, TIMEOUT_BACKEND * iterationSpeedMultiplier(iteration));
      timeoutRef3.current = setTimeout(() => {
        setStage(null);
      }, (isProjector ? TIMEOUT_TRANSITION - 2000 : 300) * iterationSpeedMultiplier(iteration));
    }

    return () => {
      if (timeoutRef1.current) {
        clearTimeout(timeoutRef1.current);
      }
      if (timeoutRef2.current) {
        clearTimeout(timeoutRef2.current);
      }
      if (timeoutRef3.current) {
        clearTimeout(timeoutRef3.current);
      }
    };
  }, [isStageIdle, mobileVisibility, isProjector]);
}
