import * as S from "./styles";
import { useState, useEffect } from "react";
import SingleRandom from "./SingleRandom";

import useAudio from "@/foundations/test-backend/2.5-duo/utils/useAudio";
import useConversation from "@/foundations/test-backend/2.5-duo/utils/useConversation";

import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

import {
  INPUT_EMBEDDINGS,
  OUTPUT_EMBEDDINGS,
} from "@/foundations/test/1-relation/utils/constant-conversation";

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
      //input: 2nd last element
      const inputEmbeddings =
        embeddings[embeddings.length - 2] || INPUT_EMBEDDINGS;
      const outputEmbeddings =
        embeddings[embeddings.length - 1] || OUTPUT_EMBEDDINGS;
      setInputEmbeddings(inputEmbeddings);
      setOutputEmbeddings(outputEmbeddings);
      setLength(inputEmbeddings.tokens.length + outputEmbeddings.tokens.length);
    }
  }, [isblack, embeddings]);

  useAudio({ isblack });

  useEffect(() => {
    document.body.style.background = "transparent";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <S.Container
      style={{
        background: "transparent",
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
      <SingleRandom
        newInputEmbeddings={inputEmbeddings}
        newOutputEmbeddings={outputEmbeddings}
        isblack={isblack}
        range={{ x: [0, 1], y: [0, 1] }}
        visible={isblack && length <= 38}
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
    </S.Container>
  );
}
