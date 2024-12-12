import { useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";

import * as CONST from "@/utils/constant";

export default function useInactivityCheck() {
  const {
    stage,
    lastInteractionTime,
    setIsEnding,
    introState,
    userName,
    setIntroState,
  } = useScreenStore();

  const stageRef = useRef(stage);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear any existing interval when stage changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (stage !== "Frontend") return;

    const timeout =
      introState <= 2
        ? CONST.INTRO_INACTIVITY_TIMEOUT
        : CONST.FRONTEND_INACTIVITY_TIMEOUT;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastInteractionTime > timeout) {
        setIsEnding(true);
      }
    };

    intervalRef.current = setInterval(checkInactivity, 10 * 1000); // Check every 10 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [stage, introState, userName, lastInteractionTime]);
}
