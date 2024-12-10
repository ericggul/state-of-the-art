import { memo, useState, useEffect } from "react";
import * as CONST from "@/utils/constant";
import EndingUI from "./EndingUI";

function Ending({ socket, isController }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Fade in on mount
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Start fade out before reset
    const fadeOutTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, CONST.TIMEOUTS.RESET - 4000);

    const resetTimeout = setTimeout(() => {
      reset();
    }, CONST.TIMEOUTS.RESET);

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

    window.location.reload(true);
  }

  return <EndingUI isVisible={isVisible} isFadingOut={isFadingOut} />;
}

export default memo(Ending);
