import { useEffect } from "react";
import useScreenStore from "@/components/screen/store";

import * as CONST from "@/utils/constant";

export default function useInactivityCheck() {
  const { stage, lastInteractionTime, setIsEnding, introState, userName } =
    useScreenStore();

  useEffect(() => {
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

    const interval = setInterval(checkInactivity, 10 * 1000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [stage, introState, userName, lastInteractionTime]);
}
