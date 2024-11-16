import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import useScreenStore from "@/components/screen/store";
import useBackendStore from "@/components/backend/store";
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
    handleReset,
  } = useScreenStore();

  const handleBackendReset = useBackendStore(
    (state) => state.handleBackendReset
  );

  const timeouts = useRef({});
  const isStageIdle = useMemo(() => stage === "Idle", [stage]);

  const clearTimeouts = () => {
    Object.values(timeouts.current).forEach((timeout) => {
      if (timeout) clearTimeout(timeout);
    });
  };

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
    const unmountFrontendDelay = isProjector
      ? TIMEOUTS.TRANSITION - TIMEOUTS.PROJECTOR_OFFSET
      : TIMEOUTS.MOBILE_RESET;

    timeouts.current.reset = setTimeout(() => {
      setStage(null);
    }, unmountFrontendDelay * multiplier);

    // Schedule ending and reset
    const endingDelay = TIMEOUTS.ENDING_BASE + multiplier * TIMEOUTS.ENDING;
    timeouts.current.ending = setTimeout(() => {
      setIsEnding(true);
    }, endingDelay);

    const resetDelay = endingDelay + TIMEOUTS.RESET;
    timeouts.current.reset = setTimeout(async () => {
      // Clear timeouts and reset state
      clearTimeouts();
      handleReset();
      handleBackendReset();

      //window.location.reload(true);
      // Use App Router refresh
      router.refresh();
    }, resetDelay);
  };

  const setFrontendState = () => {
    setStage("Frontend");
    setIsTransition(false);
  };

  useEffect(() => {
    if (isStageIdle) return;

    clearTimeouts();
    mobileVisibility ? setFrontendState() : scheduleStateChanges();

    return clearTimeouts;
  }, [isStageIdle, mobileVisibility, isProjector, iteration]);

  return null;
}
