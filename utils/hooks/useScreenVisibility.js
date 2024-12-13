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
    stage,
    iteration,
    introState,
    setStage,
    setIsEnding,
    setIsTransition,
  } = useScreenStore();

  const timeouts = useRef({});
  const isStageIdle = useMemo(() => stage === "Idle", [stage]);
  const iterationRef = useRef(iteration);

  useEffect(() => {
    iterationRef.current = iteration;
  }, [iteration]);

  const clearTimeouts = () => {
    try {
      Object.values(timeouts.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
      timeouts.current = {};
    } catch (e) {
      console.log(e);
    }
  };

  const scheduleStateChanges = () => {
    if (iterationRef.current == 0) return;
    clearTimeouts();
    const multiplier = iterationSpeedMultiplier(iterationRef.current);

    setIsTransition(true);

    timeouts.current.backend = setTimeout(() => {
      const { mobileVisibility } = useScreenStore.getState();
      if (!mobileVisibility) {
        setStage("Backend");
        setIsTransition(false);
      }
    }, TIMEOUTS.BACKEND * multiplier);

    const unmountFrontendDelay = isProjector
      ? TIMEOUTS.TRANSITION - TIMEOUTS.PROJECTOR_OFFSET
      : TIMEOUTS.MOBILE_RESET;

    timeouts.current.unmount = setTimeout(() => {
      const { mobileVisibility } = useScreenStore.getState();
      if (!mobileVisibility) {
        setStage(null);
      }
    }, unmountFrontendDelay * multiplier);

    const endingDelay = TIMEOUTS.ENDING_BASE + multiplier * TIMEOUTS.ENDING;
    const resetDelay = endingDelay + TIMEOUTS.RESET;

    timeouts.current.ending = setTimeout(() => {
      const { mobileVisibility } = useScreenStore.getState();
      if (!mobileVisibility) {
        setIsEnding(true);
      }
    }, endingDelay);

    timeouts.current.reset = setTimeout(() => {
      const { mobileVisibility } = useScreenStore.getState();
      if (!mobileVisibility) {
        clearTimeouts();
      }
    }, resetDelay);
  };

  const setFrontendState = () => {
    clearTimeouts();
    setStage("Frontend");
    setIsTransition(false);
  };

  useEffect(() => {
    console.log("👁️ Visibility effect:", {
      isStageIdle,
      mobileVisibility,
      isProjector,
      currentStage: stage,
    });

    if (isStageIdle || iterationRef.current == 0 || introState <= 2) return;

    if (mobileVisibility) {
      setFrontendState();
    } else {
      scheduleStateChanges();
    }
    return clearTimeouts;
  }, [isStageIdle, mobileVisibility, introState]);

  useEffect(() => {
    return clearTimeouts;
  }, []);

  return null;
}
