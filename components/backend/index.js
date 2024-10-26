"use client";
import dynamic from "next/dynamic";

const Embeddings25 = dynamic(() =>
  import("@/foundations/test-backend/2.5-duo/2")
);

const Output3 = dynamic(() =>
  import("@/foundations/test/3-output/random/2/2-1")
);

import { TEST_RESPONSE } from "@/foundations/test/3-output/utils/constant-en";

import * as S from "./styles";

export default function ScreenBackend() {
  return (
    <>
      <S.Container>
        <Embeddings25 />
        {/* <Output3 newResponse={TEST_RESPONSE} /> */}
      </S.Container>
    </>
  );
}
