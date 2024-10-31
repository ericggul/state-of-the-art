import * as S from "./styles";
import { useState, useEffect } from "react";

import useAudio from "@/foundations/backend/utils/useAudio";
import useConversation from "@/foundations/backend/utils/useConversation";

import {
  INPUT_EMBEDDINGS,
  OUTPUT_EMBEDDINGS,
} from "@/foundations/backend/utils/constant";

import dynamic from "next/dynamic";

const Backend4 = dynamic(() => import("@/foundations/backend/4"), {
  ssr: false,
});

export default function Wrapper() {
  const [isblack, setIsblack] = useState(true);

  const [conversations, setConversations] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);

  useConversation({
    conversations,
    setConversations,
    setEmbeddings,
    setIsblack,
  });

  const [inputEmbeddings, setInputEmbeddings] = useState(INPUT_EMBEDDINGS);
  const [outputEmbeddings, setOutputEmbeddings] = useState(OUTPUT_EMBEDDINGS);
  const [length, setLength] = useState(10);

  useEffect(() => {
    if (!isblack && embeddings.length > 0) {
      const lastIndex = embeddings.length - 1;
      const inputData =
        lastIndex > 0 ? embeddings[lastIndex - 1] : INPUT_EMBEDDINGS;
      const outputData = embeddings[lastIndex];

      console.log(inputData, outputData);

      setInputEmbeddings(inputData);
      setOutputEmbeddings(outputData);
      setLength(inputData.tokens.length + outputData.tokens.length);
    }
  }, [isblack, embeddings]);

  useAudio({ isblack });
  // useDrumRhythm({ text: outputEmbeddings.tokens.join(" ") });
  // useTTS({ text: outputEmbeddings.tokens.join(" ") });

  return (
    <S.Container
      style={{
        background: isblack ? "black" : "white",
      }}
    >
      <Backend4
        newInputEmbeddings={inputEmbeddings}
        newOutputEmbeddings={outputEmbeddings}
        isblack={isblack}
        range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
        visible={isblack && length <= 15}
        timeUnit={1}
      />

      <Backend4
        newInputEmbeddings={inputEmbeddings}
        newOutputEmbeddings={outputEmbeddings}
        isblack={isblack}
        range={{ x: [0.05, 0.95], y: [0.05, 0.95] }}
        visible={true}
        timeUnit={1}
      />
    </S.Container>
  );
}
