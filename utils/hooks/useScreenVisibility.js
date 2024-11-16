import { useEffect, useRef, useMemo } from "react";
import useScreenStore from "@/components/screen/store";
import { iterationSpeedMultiplier } from "@/utils/constant";

import { TIMEOUTS } from "@/utils/constant";

export default function useScreenVisibility() {
  const {
    mobileVisibility,
    isProjector,
    setStage,
    stage,
    setIsTransition,
    iteration,
  } = useScreenStore();

  const timeouts = useRef({});
  const isStageIdle = useMemo(() => stage === "Idle", [stage]);

  // Clear all timeouts helper
  const clearTimeouts = () => {
    Object.values(timeouts.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout);
    });
  };

  // Schedule state changes helper
  const scheduleStateChanges = () => {
    const multiplier = iterationSpeedMultiplier(iteration);

    setIsTransition(true);

    console.log(TIMEOUTS.TRANSITION * multiplier);
    // Schedule transition end
    timeouts.current.transition = setTimeout(() => {
      setIsTransition(false);
    }, TIMEOUTS.TRANSITION * multiplier);

    // Schedule backend stage
    timeouts.current.backend = setTimeout(() => {
      setStage("Backend");
    }, TIMEOUTS.BACKEND * multiplier);

    // Schedule stage reset
    const resetDelay = isProjector
      ? TIMEOUTS.TRANSITION - TIMEOUTS.PROJECTOR_OFFSET
      : TIMEOUTS.MOBILE_RESET;

    timeouts.current.reset = setTimeout(() => {
      setStage(null);
    }, resetDelay * multiplier);
  };

  // Handle frontend state
  const setFrontendState = () => {
    setStage("Frontend");
    setIsTransition(false);
  };

  useEffect(() => {
    if (isStageIdle) return;

    // Clear any existing timeouts
    clearTimeouts();

    // Set new state based on visibility
    mobileVisibility ? setFrontendState() : scheduleStateChanges();

    // Cleanup on unmount or deps change
    return clearTimeouts;
  }, [isStageIdle, mobileVisibility, isProjector, iteration]);

  return null;
}
