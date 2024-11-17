import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import useStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";

import * as CONST from "@/utils/constant";

const getRandom = (a, b) => Math.random() * (b - a) + a;

const CONCURRENT_REQUESTS_LIMIT = 9;
const MAX_RETRIES = 3;

export default function useConversation({ socket = null }) {
  const {
    conversations,
    addConversation,
    addEmbedding,
    setIsblack,
    loop,
    setLoop,
    level,
    isblack,
  } = useStore();

  const deviceIndex = useScreenStore((state) => state.deviceIndex);
  const userName = useScreenStore((state) => state.userName) || "Jeanyoon";

  const [getNewText, setGetNewText] = useState(true);
  const hasFetchedText = useRef(false);
  const embeddingsCache = useRef({});

  const INITIAL_CONVERSATION = useMemo(
    () => [
      {
        role: "user",
        content: `${userName} just left the State-of-the-Art Gallery in 2 minutes 53 seconds. He scanned through models GPT-4, Claude 3 Vision, Swin Transformer.`,
      },
      // {
      //   role: "assistant",
      //   content: `${userName} is stupid to leave the State-of-the-Art Gallery.`,
      // },
    ],
    [userName]
  );

  const timeScale = useMemo(
    () => (deviceIndex >= 0 && deviceIndex <= 4 ? deviceIndex / 4 : 1),
    [deviceIndex]
  );

  // Socket handler for receiving conversations
  useEffect(() => {
    if (!socket?.current) return;

    socket.current.on("new-screen-conversation", addConversation);
    return () => socket.current.off("new-screen-conversation");
  }, [socket?.current]);

  useEffect(() => {
    console.log("conversations", conversations);
  }, [conversations]);

  useEffect(() => {
    if (getNewText && !hasFetchedText.current) {
      hasFetchedText.current = true;
      fetchText(conversations);
      setIsblack(true);
    }
  }, [getNewText]);

  useEffect(() => {
    if (!isblack) {
      setLoop(loop + 1);
    }
  }, [isblack]);

  const processBatch = async (batch, embeddings) => {
    const promises = batch.map(async (token) => {
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const response = await axios.post("/api/openai/embeddings", {
            text: token,
            dim: 128,
          });

          if (!response.data?.length) {
            throw new Error("Invalid response data from embeddings API");
          }

          const embedding = response.data[0].embedding.map((el) =>
            parseFloat(el.toFixed(6))
          );
          embeddingsCache.current[token] = embedding;
          embeddings[token] = embedding;
          return;
        } catch (error) {
          retries++;
          console.warn(
            `Failed to fetch embedding for token "${token}", attempt ${retries}/${MAX_RETRIES}`
          );
          if (retries === MAX_RETRIES) {
            console.error(`All retries failed for token "${token}"`, error);
            const defaultEmbedding = new Array(128).fill(getRandom(-1, 1));
            embeddingsCache.current[token] = defaultEmbedding;
            embeddings[token] = defaultEmbedding;
          } else {
            await new Promise((r) =>
              setTimeout(r, 1000 * Math.pow(2, retries))
            );
          }
        }
      }
    });

    await Promise.all(promises);
  };

  const getEmbeddingsForTokens = async (tokens) => {
    try {
      const embeddings = {};
      const tokensToFetch = tokens.filter(
        (token) => !embeddingsCache.current[token]
      );

      const batches = [];
      for (
        let i = 0;
        i < tokensToFetch.length;
        i += CONCURRENT_REQUESTS_LIMIT
      ) {
        batches.push(tokensToFetch.slice(i, i + CONCURRENT_REQUESTS_LIMIT));
      }

      for (const batch of batches) {
        await processBatch(batch, embeddings);
      }

      tokens.forEach((token) => {
        if (embeddingsCache.current[token]) {
          embeddings[token] = embeddingsCache.current[token];
        }
      });

      return embeddings;
    } catch (e) {
      console.error("Failed to fetch embeddings for tokens:", e);
      throw e;
    }
  };

  const getNextText = async () => {
    const timeout =
      CONST.WHITE_TIME[Math.min(level, CONST.WHITE_TIME.length - 1)];
    await new Promise((r) => setTimeout(r, timeout));
    hasFetchedText.current = false;
    setGetNewText(true);
  };

  const fetchEmbedding = async ({ tokens }) => {
    if (!tokens?.length) return;

    try {
      const uniqueTokens = [...new Set(tokens)];
      const embeddings = await getEmbeddingsForTokens(uniqueTokens);

      const timeout =
        timeScale *
        CONST.EXTRA_BLACK_TIME[
          Math.min(level, CONST.EXTRA_BLACK_TIME.length - 1)
        ];
      await new Promise((r) => setTimeout(r, timeout));

      addEmbedding({ embeddings, tokens });
      setIsblack(false);
      await getNextText();
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
    }
  };

  const fetchText = async (conversations) => {
    try {
      const formattedConversations = formatConversations(conversations);
      setGetNewText(false);

      const temperature = Math.min(0.7 + (loop / 10) * 0.3, 1.65);
      const maxTokens = level >= 5 ? 27 : 22;

      const response = await axios.post("/api/openai/gpt-4o", {
        conversations: formattedConversations,
        params: { temperature, userName },
        maxTokens,
      });

      if (
        !response.data?.message?.content ||
        !response.data?.logprobs?.content
      ) {
        throw new Error("No response data or message content");
      }

      const data = deviceIndex
        ? { ...response.data, deviceIndex }
        : response.data;

      addConversation(data);
      socket?.current?.emit("screen-new-conversation", data);

      const tokens = response.data.logprobs.content.map((el) => el.token);
      fetchEmbedding({ tokens });
    } catch (e) {
      console.log(e, "get gpt response error");
      await new Promise((r) => setTimeout(r, 500));
      setGetNewText(true);
    }
  };

  const formatConversations = (conversations) => {
    return [
      ...INITIAL_CONVERSATION,
      ...conversations.map((el) => el.message),
    ].slice(-20);
  };
}
