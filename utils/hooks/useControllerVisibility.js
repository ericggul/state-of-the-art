import { useEffect, useRef, useMemo } from "react";
import useControllerStore from "@/components/controller/store";
import {
  iterationSpeedMultiplier,
  TIMEOUTS,
  INACTIVITY_TIMEOUT,
} from "@/utils/constant";

export default function useControllerVisibility() {
  const {
    mobileVisibility,
    iteration,
    stage,
    setStage,
    setIsReset,
    lastInteractionTime,
  } = useControllerStore();

  const timeouts = useRef({});
  const isStageIdle = useMemo(() => stage === "Idle", [stage]);
  const visibilityRef = useRef(mobileVisibility);

  const clearTimeouts = () => {
    Object.values(timeouts.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout);
    });
    timeouts.current = {};
  };

  const scheduleStateChanges = () => {
    if (iteration == 0) return;

    clearTimeouts();

    const multiplier = iterationSpeedMultiplier(iteration);

    timeouts.current.backend = setTimeout(() => {
      if (!visibilityRef.current) {
        setStage("Backend");
      }
    }, TIMEOUTS.BACKEND * multiplier);

    const endingDelay = TIMEOUTS.ENDING_BASE + multiplier * TIMEOUTS.ENDING;
    const resetDelay = endingDelay + TIMEOUTS.RESET;
    timeouts.current.reset = setTimeout(() => {
      if (!visibilityRef.current) {
        setIsReset(true);
      }
    }, resetDelay);
  };

  const setFrontendState = () => {
    clearTimeouts();
    setStage("Frontend");
  };

  // Main visibility effect
  useEffect(() => {
    console.log("isStageIdle", isStageIdle);
    console.log("iteration", iteration);

    if (isStageIdle || iteration == 0) return;

    visibilityRef.current = mobileVisibility;

    console.log("mobileVisibility", mobileVisibility);
    if (mobileVisibility) {
      setFrontendState();
    } else {
      scheduleStateChanges();
    }

    return clearTimeouts;
  }, [isStageIdle, mobileVisibility, iteration]);

  // Inactivity check effect
  useEffect(() => {
    if (stage !== "Frontend") return;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastInteractionTime > INACTIVITY_TIMEOUT) {
        setIsReset(true);
      }
    };

    const interval = setInterval(checkInactivity, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [stage, lastInteractionTime]);

  // Cleanup effect
  useEffect(() => {
    return clearTimeouts;
  }, []);

  return null;
}
