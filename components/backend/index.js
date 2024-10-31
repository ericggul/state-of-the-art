import * as S from "./styles";
import { useEffect } from "react";

import useAudio from "@/foundations/backend/utils/useAudio";
import useConversation from "@/foundations/backend/utils/useConversation";
import { INPUT_EMBEDDINGS } from "@/foundations/backend/shared/constants/conversation";
import dynamic from "next/dynamic";
import useStore from "./store";

import Backend2 from "@/foundations/backend/2";
import Backend3 from "@/foundations/backend/3";
import Backend4 from "@/foundations/backend/4";

export default function Backend() {
  const { isblack, length, loop, level } = useStore();

  useConversation();
  useAudio();

  useEffect(() => {
    console.log(`Loop: ${loop}, Level: ${level}`);
  }, [loop, level]);

  return (
    <S.Container style={{ background: isblack ? "black" : "white" }}>
      {/* <Backend4
        range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
        visible={isblack && length <= 15}
        timeUnit={1}
      /> */}

      {level <= 0 && (
        <Backend2
          range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
          visible={true}
          timeUnit={1}
        />
      )}

      {level === 1 && (
        <Backend3
          range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
          visible={true}
          timeUnit={1}
        />
      )}

      {level === 2 && (
        <Backend4
          range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
          visible={true}
          timeUnit={1}
        />
      )}

      {/* <Backend4
        range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
        visible={true}
        timeUnit={1}
      /> */}
    </S.Container>
  );
}
