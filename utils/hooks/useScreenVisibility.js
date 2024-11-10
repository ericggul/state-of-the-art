import { useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";

export default function useScreenVisibility() {
  const { mobileVisibility, isProjector, setStage, stage, setIsTransition } =
    useScreenStore();

  const timers = useRef({});

  useEffect(() => {
    if (stage === "Idle") return;

    // Clear any existing timers
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};

    if (mobileVisibility) {
      setStage("Frontend");
      setIsTransition(false);
    } else {
      setIsTransition(true);

      timers.current.transition = setTimeout(() => {
        setIsTransition(false);
      }, 5000);

      timers.current.backend = setTimeout(() => {
        setStage("Backend");
      }, 6000);

      timers.current.stage = setTimeout(
        () => {
          setStage(null);
        },
        isProjector ? 3000 : 300
      );
    }

    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, [stage, mobileVisibility, isProjector]);
}
