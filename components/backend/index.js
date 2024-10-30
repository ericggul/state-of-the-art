"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Embeddings25 = dynamic(() =>
  import("@/foundations/test-backend/3-chaos/2")
);

const Output3 = dynamic(() =>
  import("@/foundations/test/3-output/random/2/2-1")
);

import { TEST_RESPONSE } from "@/foundations/test/3-output/utils/constant-en";

import * as S from "./styles";

export default function ScreenBackend({ showBackend }) {
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    if (showBackend) {
      setGlitchEffect(true);

      const stopGlitch = setTimeout(() => {
        setGlitchEffect(false);
      }, 2700); // Stop glitching after 2 seconds

      return () => {
        clearTimeout(stopGlitch);
      };
    } else {
      setGlitchEffect(false);
    }
  }, [showBackend]);

  return (
    <S.Container $glitchEffect={glitchEffect}>
      <Embeddings25 />
      {/* <Output3 newResponse={TEST_RESPONSE} /> */}
    </S.Container>
  );
}
