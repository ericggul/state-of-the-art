import * as S from "./styles";
import React, { useState, useEffect } from "react";
import SingleRandom from "./SingleRandom";
import Transcript from "./components/Transcript";
import TopText from "./components/TopText";

import useAudio from "../../utils/useAudio";
import useConversation from "../../utils/useConversation";

import {
  INPUT_EMBEDDINGS,
  OUTPUT_EMBEDDINGS,
} from "@/foundations/test/1-relation/utils/constant-conversation";

export default React.memo(function Wrapper() {
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

      setInputEmbeddings(inputData);
      setOutputEmbeddings(outputData);
      setLength(inputData.tokens.length + outputData.tokens.length);
    }
  }, [isblack, embeddings]);

  useAudio({ isblack });

  return (
    <S.Container
      style={{
        background: isblack ? "black" : "white",
      }}
    >
      <SingleRandom
        newInputEmbeddings={inputEmbeddings}
        newOutputEmbeddings={outputEmbeddings}
        isblack={isblack}
        range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
        visible={isblack && length <= 15}
        timeUnit={1}
      />

      <SingleRandom
        newInputEmbeddings={inputEmbeddings}
        newOutputEmbeddings={outputEmbeddings}
        isblack={isblack}
        range={{ x: [0.1, 0.9], y: [0.1, 0.9] }}
        visible={true}
        timeUnit={1}
      />
      <TopText isblack={isblack} />

      <Transcript conversations={conversations} isblack={isblack} />
    </S.Container>
  );
});
