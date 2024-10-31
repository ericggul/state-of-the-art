import * as S from "./styles";
import { useEffect } from "react";

import useAudio from "@/foundations/backend/utils/useAudio";
import useConversation from "@/foundations/backend/utils/useConversation";
import { INPUT_EMBEDDINGS } from "@/foundations/backend/utils/constant";
import dynamic from "next/dynamic";
import useStore from "./store";

const Backend4 = dynamic(() => import("@/foundations/backend/4"), {
  ssr: false,
});

export default function Wrapper() {
  const { isblack, length } = useStore();

  useConversation();
  useAudio();

  return (
    <S.Container style={{ background: isblack ? "black" : "white" }}>
      <Backend4
        range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
        visible={isblack && length <= 15}
        timeUnit={1}
      />

      <Backend4
        range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
        visible={true}
        timeUnit={1}
      />
    </S.Container>
  );
}
