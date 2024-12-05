import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import useStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";

//constants
import * as CONST from "@/utils/constant";
import { generateInitialConversation } from "@/utils/constant/conversation";

const getRandom = (a, b) => Math.random() * (b - a) + a;

const CONCURRENT_REQUESTS_LIMIT = 9;
const MAX_RETRIES = 3;

// Add utility function at the top level
const withTimeout = async (promise, timeoutMs) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

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
    () => generateInitialConversation(userName, deviceIndex),
    [userName, deviceIndex]
  );

  const timeScale = useMemo(
    () => (deviceIndex >= 0 && deviceIndex <= 3 ? deviceIndex / 4 : 0),
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

      // Add timeout to embeddings fetch
      const embeddings = await withTimeout(
        getEmbeddingsForTokens(uniqueTokens),
        CONST.API_TIMEOUT
      );

      const timeout =
        timeScale *
          CONST.EXTRA_BLACK_TIME[
            Math.min(level, CONST.EXTRA_BLACK_TIME.length - 1)
          ] +
        1000;
      await new Promise((r) => setTimeout(r, timeout));

      // Only update states if we got valid embeddings
      addEmbedding({ embeddings, tokens });
      setIsblack(false);
      await getNextText();
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
      // Skip to next cycle without updating any state
      setIsblack(false);
      await getNextText();
    }
  };

  const fetchText = async (conversations) => {
    try {
      const formattedConversations = formatConversations(conversations);
      setGetNewText(false);

      const temperature = Math.min(0.7 + (loop / 10) * 0.25, 1.3);
      const maxTokens = level >= 5 ? 27 : 22;

      // Add timeout to GPT fetch
      const response = await withTimeout(
        axios.post("/api/openai/gpt-4o", {
          conversations: formattedConversations,
          params: { temperature, userName },
          maxTokens,
        }),
        CONST.API_TIMEOUT
      );

      if (
        !response.data?.message?.content ||
        !response.data?.logprobs?.content
      ) {
        throw new Error("No response data or message content");
      }

      const data = deviceIndex
        ? { ...response.data, deviceIndex }
        : response.data;

      // Only update states if we got valid response
      addConversation(data);
      socket?.current?.emit("screen-new-conversation", data);

      const tokens = response.data.logprobs.content.map((el) => el.token);
      fetchEmbedding({ tokens });
    } catch (e) {
      console.log(e, "get gpt response error");
      // Skip to next cycle without updating any state
      await new Promise((r) => setTimeout(r, 500));
      setIsblack(false);
      await getNextText();
    }
  };

  const formatConversations = (conversations) => {
    return [
      ...INITIAL_CONVERSATION,
      ...conversations.map((el) => el.message),
    ].slice(-15);
  };
}
