"use client";

import { memo, useState, useEffect, useCallback } from "react";
import * as S from "./styles";
import dynamic from "next/dynamic";

const IdlePC = dynamic(() => import("@/components/screen/idle/pc/index"));
const IdleProjector = dynamic(() =>
  import("@/components/screen/idle/projector")
);

const UNMOUNT_DELAY = 3000;
const FADE_DURATION = 1000; // Audio fade duration

const Idle = memo(function Idle({ $isFrontend, type }) {
  const [unmount, setUnmount] = useState(false);
  const [isUnmounting, setIsUnmounting] = useState(false);

  useEffect(() => {
    if (!$isFrontend) {
      setUnmount(false);
      setIsUnmounting(false);
      return;
    }

    setIsUnmounting(true);
    const timer = setTimeout(() => setUnmount(true), UNMOUNT_DELAY);
    return () => clearTimeout(timer);
  }, [$isFrontend]);

  return (
    <S.Container $isFrontend={$isFrontend}>
      {!unmount && (
        <>
          {type === "projector" && (
            <IdleProjector
              $isFrontend={$isFrontend}
              isUnmounting={isUnmounting}
            />
          )}
          {type === "pc" && <IdlePC $isFrontend={$isFrontend} />}
        </>
      )}
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
