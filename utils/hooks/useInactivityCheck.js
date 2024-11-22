import { useEffect } from "react";
import useScreenStore from "@/components/screen/store";

import * as CONST from "@/utils/constant";

export default function useInactivityCheck() {
  const { stage, lastInteractionTime, setIsEnding } = useScreenStore();

  useEffect(() => {
    if (stage !== "Frontend") return;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastInteractionTime > CONST.INACTIVITY_TIMEOUT) {
        setIsEnding(true);
      }
    };

    const interval = setInterval(checkInactivity, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [stage, lastInteractionTime]);
}
