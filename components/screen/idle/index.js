"use client";

import { memo, useState, useEffect } from "react";
import * as S from "./styles";

import dynamic from "next/dynamic";

const IdlePC = dynamic(() => import("@/components/screen/idle/pc/index-v2"));
const IdleProjector = dynamic(() =>
  import("@/components/screen/idle/projector")
);

const Idle = memo(function Idle({ $isFrontend, type }) {
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    if ($isFrontend) {
      const timer = setTimeout(() => {
        setUnmount(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setUnmount(false);
    }
  }, [$isFrontend]);

  return (
    <S.Container $isFrontend={$isFrontend}>
      {!unmount && (
        <>
          {type === "projector" && <IdleProjector $isFrontend={$isFrontend} />}
          {type === "pc" && <IdlePC $isFrontend={$isFrontend} />}
        </>
      )}
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
