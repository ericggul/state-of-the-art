import * as S from "./styles";
import { memo, useState, useEffect } from "react";
import useScreenStore from "@/components/screen/store";
import * as CONST from "@/utils/constant";

function Ending() {
  const [seconds, setSeconds] = useState(CONST.TIMEOUTS.RESET / 1000);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Fade in on mount
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Start countdown
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // Start fade out before reset
    const fadeOutTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, CONST.TIMEOUTS.RESET - 1000); // Start fade out 1 second before reset

    return () => {
      clearInterval(interval);
      clearTimeout(fadeInTimeout);
      clearTimeout(fadeOutTimeout);
    };
  }, []);

  return (
    <S.Container $isVisible={isVisible} $isFadingOut={isFadingOut}>
      <h1>DUMMY ENDING</h1>
      <p>DUMMY CREDIT</p>
      <p>Session Reset in {seconds.toFixed(0)} seconds</p>
    </S.Container>
  );
}

export default memo(Ending);
