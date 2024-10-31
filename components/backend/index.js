import * as S from "./styles";
import { useEffect } from "react";

import useAudio from "@/components/backend/utils/useAudio";
import useConversation from "@/components/backend/utils/useConversation";

import useStore from "./store";

import Backend0 from "@/foundations/backend/0";
import Backend1 from "@/foundations/backend/1";
import Backend2 from "@/foundations/backend/2";
import Backend3 from "@/foundations/backend/3";
import Backend4 from "@/foundations/backend/4";

const TESTING = false;

export default function Backend() {
  const { isblack, length, loop, level } = useStore();

  useConversation();
  useAudio();

  useEffect(() => {
    console.log(`Loop: ${loop}, Level: ${level}`);
  }, [loop, level]);

  return (
    <S.Container style={{ background: isblack ? "black" : "white" }}>
      {TESTING ? (
        <Backend0 visible={true} timeUnit={1} />
      ) : (
        <>
          {level === 0 && (
            <Backend0
              range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
              visible={true}
              timeUnit={1}
            />
          )}
          {level === 1 && (
            <Backend1
              range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
              visible={true}
              timeUnit={1}
            />
          )}

          {level === 2 && (
            <Backend2
              range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
              visible={true}
              timeUnit={1}
            />
          )}

          {level === 3 && (
            <Backend3
              range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
              visible={true}
              timeUnit={1}
            />
          )}

          {level === 4 && (
            <Backend4
              range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
              visible={true}
              timeUnit={1}
            />
          )}
        </>
      )}
    </S.Container>
  );
}
