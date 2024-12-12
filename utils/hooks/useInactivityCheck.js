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

  const intervalRef = useRef(null);
  const stageRef = useRef(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (stage !== "Frontend") return;

    const timeout =
      introState <= 2
        ? CONST.INTRO_INACTIVITY_TIMEOUT
        : introState === 4
        ? CONST.INACTIVITY_TIMEOUT
        : CONST.FRONTEND_INACTIVITY_TIMEOUT;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastInteractionTime >= timeout - 1000) {
        if (stageRef.current === "Frontend") {
          if (introState == 3) setIntroState(4);
          else setIsEnding(true);
        }
      }
    };

    intervalRef.current = setInterval(checkInactivity, 10 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [stage, introState, userName, lastInteractionTime]);

  useEffect(() => {
    if (introState === 4) {
      setIntroState(3);
    }
  }, [lastInteractionTime]);
}
