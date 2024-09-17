import * as S from "./styles";

import { useState, useEffect } from "react";
import useSocket from "@/utils/socket/on-off/useSocketScreen";

import dynamic from "next/dynamic";
import { INPUT_EMBEDDINGS, OUTPUT_EMBEDDINGS, MULTI_LAYERS_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant-conversation";

const Yakitori4 = dynamic(() => import("@/foundations/test-frontend/yakitori/0/0-4"));
const Random26 = dynamic(() => import("@/foundations/test/1-relation/random/2/2-6"));

export default function El() {
  const socket = useSocket({
    handleNewMobileConnect,
    handleNewMobileDisconnect,
    handleNewVisibilityChange,
  });

  const [visible, setVisible] = useState(true);

  function handleNewMobileConnect(data) {
    console.log("new mobile connected", data);
  }

  function handleNewMobileDisconnect(data) {
    console.log("new mobile disconnected", data);
  }

  function handleNewVisibilityChange(data) {
    console.log("new visibility change", data);
    setVisible(data.isVisible);
  }

  return (
    <>
      <S.Container
        style={{
          opacity: visible ? 1 : 0,
        }}
      >
        <Yakitori4 enableDeviceControls={false} />
      </S.Container>
      <S.Container
        style={{
          opacity: !visible ? 1 : 0,
        }}
      >
        <Random26 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />
      </S.Container>
    </>
  );
}
