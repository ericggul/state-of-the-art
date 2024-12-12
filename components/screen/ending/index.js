import { memo, useState, useEffect, useRef } from "react";
import * as CONST from "@/utils/constant";
import EndingUI from "./EndingUI";
import useScreenStore from "@/components/screen/store";

function Ending({ socket, isController }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const stage = useScreenStore((state) => state.stage);
  const resetTimeoutRef = useRef(
    stage === "Frontend" ? CONST.TIMEOUTS.RESET_FRONTEND : CONST.TIMEOUTS.RESET
  );

  useEffect(() => {
    // Fade in on mount
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Start fade out before reset
    const fadeOutTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, resetTimeoutRef.current - 4000);

    const resetTimeout = setTimeout(() => {
      reset();
    }, resetTimeoutRef.current);

    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(resetTimeout);
    };
  }, []);

  function reset() {
    try {
      socket.current?.emit("screen-force-reset-active-mobile");

      socket.current?.emit("controller-new-stage-and-reset", {
        isReset: true,
        type: "reset",
        force: true,
      });
    } catch (e) {
      console.log(e);
    }

    window.location.reload();
  }

  return <EndingUI isVisible={isVisible} isFadingOut={isFadingOut} />;
}

export default memo(Ending);
