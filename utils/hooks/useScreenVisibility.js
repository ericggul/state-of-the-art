import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import useScreenStore from "@/components/screen/store";
import { iterationSpeedMultiplier } from "@/utils/constant";
import { TIMEOUTS } from "@/utils/constant";

export default function useScreenVisibility() {
  const router = useRouter();
  const {
    mobileVisibility,
    isProjector,
    setStage,
    stage,
    setIsTransition,
    iteration,
    setIsEnding,
  } = useScreenStore();

  const timeouts = useRef({});
  const isStageIdle = useMemo(() => stage === "Idle", [stage]);
  const visibilityRef = useRef(mobileVisibility);

  const clearTimeouts = () => {
    console.log("🧹 Clearing timeouts:", Object.keys(timeouts.current));
    Object.values(timeouts.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout);
    });
    timeouts.current = {};
  };

  const scheduleStateChanges = () => {
    if (iteration == 0) return;

    clearTimeouts();

    const multiplier = iterationSpeedMultiplier(iteration);
    console.log("📅 Scheduling state changes:", { iteration, multiplier });

    setIsTransition(true);

    timeouts.current.transition = setTimeout(() => {
      if (!visibilityRef.current) {
        console.log("🔄 Transition ended, visibility:", visibilityRef.current);
        setIsTransition(false);
      }
    }, TIMEOUTS.TRANSITION * multiplier);

    timeouts.current.backend = setTimeout(() => {
      if (!visibilityRef.current) {
        console.log("🔙 Setting stage to Backend");
        setStage("Backend");
      }
    }, TIMEOUTS.BACKEND * multiplier);

    const unmountFrontendDelay = isProjector
      ? TIMEOUTS.TRANSITION - TIMEOUTS.PROJECTOR_OFFSET
      : TIMEOUTS.MOBILE_RESET;

    timeouts.current.unmount = setTimeout(() => {
      if (!visibilityRef.current) {
        setStage(null);
      }
    }, unmountFrontendDelay * multiplier);

    const endingDelay = TIMEOUTS.ENDING_BASE + multiplier * TIMEOUTS.ENDING;
    const resetDelay = endingDelay + TIMEOUTS.RESET;

    console.log("⏱️ Delays:", {
      unmountFrontend: unmountFrontendDelay,
      ending: endingDelay,
      reset: resetDelay,
      isProjector,
    });

    timeouts.current.ending = setTimeout(() => {
      if (!visibilityRef.current) {
        setIsEnding(true);
      }
    }, endingDelay);

    timeouts.current.reset = setTimeout(() => {
      if (!visibilityRef.current) {
        clearTimeouts();
      }
    }, resetDelay);
  };

  const setFrontendState = () => {
    console.log("🎭 Setting Frontend state");
    clearTimeouts();
    setStage("Frontend");
    setIsTransition(false);
  };

  useEffect(() => {
    console.log("👁️ Visibility effect:", {
      isStageIdle,
      mobileVisibility,
      isProjector,
      iteration,
      currentStage: stage,
    });

    if (isStageIdle || iteration == 0) return;

    visibilityRef.current = mobileVisibility;

    if (mobileVisibility) {
      setFrontendState();
    } else {
      scheduleStateChanges();
    }

    return clearTimeouts;
  }, [isStageIdle, mobileVisibility, isProjector, iteration]);

  useEffect(() => {
    return clearTimeouts;
  }, []);

  return null;
}
