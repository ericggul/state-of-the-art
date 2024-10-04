import * as S from "./styles";
import { useState, useEffect } from "react";
import SingleRandom from "./SingleRandom";

import useAudio from "./useAudio";
import useConversation from "./useConversation";

import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

import { INPUT_EMBEDDINGS, OUTPUT_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant-conversation";

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
    if (!isblack) {
      let inputEmbeddingsData = INPUT_EMBEDDINGS;
      let outputEmbeddingsData = OUTPUT_EMBEDDINGS;

      if (embeddings.length >= 2) {
        // Use the last two embeddings
        inputEmbeddingsData = embeddings[embeddings.length - 2];
        outputEmbeddingsData = embeddings[embeddings.length - 1];
      } else if (embeddings.length === 1) {
        // Only one embedding available
        inputEmbeddingsData = INPUT_EMBEDDINGS;
        outputEmbeddingsData = embeddings[0];
      }

      setInputEmbeddings(inputEmbeddingsData);
      setOutputEmbeddings(outputEmbeddingsData);
      setLength(inputEmbeddingsData.tokens.length + outputEmbeddingsData.tokens.length);
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
        range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
        visible={isblack && length <= 20}
        timeUnit={1}
      />
      <SingleRandom
        newInputEmbeddings={inputEmbeddings}
        newOutputEmbeddings={outputEmbeddings}
        isblack={isblack}
        range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
        visible={isblack && length <= 28}
        timeUnit={1}
      />
      <SingleRandom newInputEmbeddings={inputEmbeddings} newOutputEmbeddings={outputEmbeddings} isblack={isblack} range={{ x: [0, 1], y: [0, 1] }} visible={isblack && length <= 38} timeUnit={1} />
      <SingleRandom newInputEmbeddings={inputEmbeddings} newOutputEmbeddings={outputEmbeddings} isblack={isblack} range={{ x: [0.1, 0.9], y: [0.1, 0.9] }} visible={true} timeUnit={1} />
    </S.Container>
  );
}
