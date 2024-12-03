import { useEffect, useRef } from "react";

import { CONTROLLER_AUTO_RESET_INTERVAL } from "@/utils/constant";

export default function useAutoReset({ stage, handleForceReset }) {
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Only set up timer if mobile is inactive
    if (stage === "Idle") {
      timerRef.current = setInterval(() => {
        console.log("🔄 Auto reset triggered - mobile inactive for 10 minutes");
        handleForceReset();
      }, CONTROLLER_AUTO_RESET_INTERVAL);
    }

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stage, handleForceReset]);
}
