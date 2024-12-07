import { memo, useState, useEffect } from "react";
import * as CONST from "@/utils/constant";
import EndingUI from "./EndingUI";

function Ending() {
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
    window.location.reload(true);
  }

  return <EndingUI isVisible={isVisible} isFadingOut={isFadingOut} />;
}

export default memo(Ending);
