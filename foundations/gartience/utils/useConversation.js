import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import * as CONST from "@/utils/constant";
import { generateInitialConversation } from "./generateInitialConversation";
import useMobileStore from "@/foundations/gartience/mobile/store";

const TIME_OUT = 10 * 1000;
const BLACK_TIME = 1.5 * 1000;
const WHITE_TIME = 3 * 1000;

// Add timeout utility
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

export default function useConversation({
  conversations,
  setConversations,
  setEmbeddings,
  setIsblack,
  isScreen = false,
}) {
  const username = useMobileStore((state) => state.username) || "Jeanyoon Choi";
  const [getNewText, setGetNewText] = useState(true);
  const hasFetchedText = useRef(false);
  const embeddingsCache = useRef({});

  // Add these states to track progression
  const [loop, setLoop] = useState(0);
  const level = Math.floor(loop / 3);

  const INITIAL_CONVERSATION = useMemo(
    () => generateInitialConversation(username || "Mobile User"),
    [username]
  );

  useEffect(() => {
    if (getNewText && !hasFetchedText.current) {
      hasFetchedText.current = true;
      fetchText(conversations);
      setIsblack(true);
    }
  }, [getNewText]);

  async function fetchText(conversations) {
    try {
      const formattedConversations = [
        ...INITIAL_CONVERSATION,
        ...conversations.map((el) => el.message),
      ].slice(-10);

      setGetNewText(false);

      const temperature = Math.min(0.7 + (loop / 10) * 0.25, 1.3);
      const maxTokens = isScreen ? 35 : 22;
      console.log(maxTokens);

      const response = await withTimeout(
        axios.post("/api/openai/gpt-4o", {
          conversations: formattedConversations,
          params: {
            temperature,
            userName: username || "Mobile User",
          },
          maxTokens,
        }),
        TIME_OUT
      );

      if (
        !response.data?.message?.content ||
        !response.data?.logprobs?.content
      ) {
        throw new Error("No response data or message content");
      }

      setConversations((prev) => [...prev, response.data]);
      const tokens = response.data.logprobs.content.map((el) => el.token);
      fetchEmbedding({ tokens });
    } catch (e) {
      console.log(e, "get gpt response error");
      await new Promise((r) => setTimeout(r, 500));
      setIsblack(false);
      await getNextText();
    }
  }

  async function getNextText() {
    const timeout = WHITE_TIME;
    await new Promise((r) => setTimeout(r, timeout));
    hasFetchedText.current = false;
    setGetNewText(true);
  }

  async function fetchEmbedding({ tokens }) {
    if (!tokens?.length) return;

    try {
      const uniqueTokens = [...new Set(tokens)];
      const embeddings = await withTimeout(
        getEmbeddingsForTokens(uniqueTokens),
        TIME_OUT
      );

      const timeout = BLACK_TIME;
      await new Promise((r) => setTimeout(r, timeout));

      setEmbeddings((prev) => [...prev, { embeddings, tokens }]);
      setIsblack(false);
      setLoop((l) => l + 1);
      await getNextText();
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
      setIsblack(false);
      await getNextText();
    }
  }

  // Helper function to fetch embeddings for an array of tokens
  async function getEmbeddingsForTokens(tokens) {
    try {
      const embeddings = {};

      // Tokens that need to be fetched (not in cache)
      const tokensToFetch = tokens.filter(
        (token) => !embeddingsCache.current[token]
      );

      // Limit the number of concurrent requests to prevent rate limiting
      const CONCURRENT_REQUESTS_LIMIT = 8;

      // Function to process tokens in batches
      const processBatch = async (batch) => {
        const promises = batch.map(async (token) => {
          const response = await axios.post("/api/openai/embeddings", {
            text: token,
            dim: 128,
          });

          if (!response.data || !Array.isArray(response.data)) {
            throw new Error("Invalid response data from embeddings API");
          }

          // Store the embedding in cache and in the embeddings object
          const embedding = response.data[0].embedding.map((el) =>
            parseFloat(el.toFixed(6))
          );
          embeddingsCache.current[token] = embedding;
          embeddings[token] = embedding;
        });

        await Promise.all(promises);
      };

      // Split tokens into batches based on the concurrency limit
      const batches = [];
      for (
        let i = 0;
        i < tokensToFetch.length;
        i += CONCURRENT_REQUESTS_LIMIT
      ) {
        batches.push(tokensToFetch.slice(i, i + CONCURRENT_REQUESTS_LIMIT));
      }

      // Process each batch sequentially
      for (const batch of batches) {
        await processBatch(batch);
      }

      // Add cached embeddings to the result
      for (const token of tokens) {
        if (embeddingsCache.current[token]) {
          embeddings[token] = embeddingsCache.current[token];
        }
      }
      console.log(embeddings);
      return embeddings;
    } catch (e) {
      console.error("Failed to fetch embeddings for tokens:", e);
      throw e; // Re-throw the error to be caught in the outer try-catch
    }
  }
}
