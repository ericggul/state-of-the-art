import * as S from "./styles";
import { memo, useState, useEffect } from "react";
import useScreenStore from "@/components/screen/store";
import useBackendStore from "@/components/backend/store";
import * as CONST from "@/utils/constant";
import { useRouter } from "next/navigation";

function Ending() {
  const [seconds, setSeconds] = useState((CONST.TIMEOUTS.RESET - 1000) / 1000);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleReset = useScreenStore((state) => state.handleReset);
  const handleBackendReset = useBackendStore(
    (state) => state.handleBackendReset
  );

  const router = useRouter();

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
    }, CONST.TIMEOUTS.RESET - 3000); // Start fade out 1 second before reset

    const resetTimeout = setTimeout(() => {
      reset();
    }, CONST.TIMEOUTS.RESET);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeInTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(resetTimeout);
    };
  }, []);

  function reset() {
    handleReset();
    handleBackendReset();

    //window.location.reload(true);
    // Use App Router refresh
    router.refresh();
  }

  return (
    <S.Container $isVisible={isVisible} $isFadingOut={isFadingOut}>
      <h1>DUMMY ENDING</h1>
      <p>DUMMY CREDIT</p>
      <p>Session Reset in {seconds.toFixed(0)} seconds</p>
    </S.Container>
  );
}

export default memo(Ending);
