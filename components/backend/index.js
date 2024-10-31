"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import useConversation from "./utils/useConversation";
import useAudio from "./utils/useAudio";

import {
  INPUT_EMBEDDINGS,
  OUTPUT_EMBEDDINGS,
} from "./utils/constant-conversation";

const Backend1 = dynamic(() => import("@/foundations/backend/1"));
const Backend2 = dynamic(() => import("@/foundations/backend/2"));
const Backend3 = dynamic(() => import("@/foundations/backend/3"));
const Backend4 = dynamic(() => import("@/foundations/backend/4"));

import * as S from "./styles";

export default function ScreenBackend({ showBackend = true }) {
  //later on for multi-device integration, socket-related logic will be placed here

  ///LOOP: INCREASES AS EVERY ITERATION PROGRESES
  const [loop, setLoop] = useState(0);

  //LEVEL: INCREASES from 1-4, 1-4 as loop initially increasees, stick on 4 after 4
  const [level, setLevel] = useState(1);

  //therefore, conversation-related logic will be placed here

  //conversation management here?

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

  return (
    <S.Container $glitchEffect={false}>
      {level === 1 && <Backend1 />}
      {level === 2 && <Backend2 />}
      {level === 3 && <Backend3 />}
      {level === 4 && <Backend4 />}
    </S.Container>
  );
}
