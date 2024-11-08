import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import useStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";

//time configs
//Should change accordingly to the testing status
export const EXTRA_BLACK_TIME = [1500, 4000, 2000, 2000, 1000, 0, 0];
export const WHITE_TIME = [3000, 4000, 3000, 1500, 2000, 1000, 1500];

//TEMPORARY TIME CONFIG FOR TESTING
// export const EXTRA_BLACK_TIME = [1500, 4000, 2000, 2000, 1000, 0, 5000];
// export const WHITE_TIME = [3000, 4000, 3000, 1500, 2000, 1000, 5000];

const INITIAL_TEXT = `Jeanyoon had become one of the State of the Art Architecture Neural Network. `;

const getRandom = (a, b) => Math.random() * (b - a) + a;
export default function useConversation() {
  const {
    conversations,
    addConversation,
    addEmbedding,
    setIsblack,
    loop,
    setLoop,
    level,
    setLevel,
    isblack,
  } = useStore();

  const deviceIndex = useScreenStore((state) => state.deviceIndex);
  const timeScale = useMemo(
    () => (deviceIndex >= 0 && deviceIndex <= 4 ? deviceIndex / 4 : 1),
    [deviceIndex]
  );

  const [getNewText, setGetNewText] = useState(true);
  const hasFetchedText = useRef(false);
  const embeddingsCache = useRef({});

  useEffect(() => {
    if (getNewText && !hasFetchedText.current) {
      hasFetchedText.current = true;
      fetchText(conversations);
      setIsblack(true);
    }
  }, [getNewText]);

  useEffect(() => {
    if (!isblack) {
      // When switching to white
      const nextLoop = loop + 1;
      setLoop(nextLoop);
    }
  }, [isblack]);

  async function fetchText(conversations) {
    try {
      const text =
        conversations.length < 6
          ? INITIAL_TEXT +
            conversations.map((el) => el.message.content).join(" ")
          : conversations
              .map((el) => el.message.content)
              .slice(-6)
              .join(" ");

      setGetNewText(false);

      const temperature = Math.min(0.7 + (loop / 10) * 0.4, 1.2);

      const endpoint =
        level >= 4 ? "/api/openai/gpt-4o-mini" : "/api/openai/gpt-4o-poem";
      const response = await axios.post(endpoint, {
        text,
        params: { temperature: temperature },
      });

      if (
        !response.data ||
        !response.data.message.content ||
        !response.data.logprobs.content
      ) {
        throw new Error("No response data or message content");
      }

      addConversation(response.data);

      const tokens = response.data.logprobs.content.map((el) => el.token);
      fetchEmbedding({ tokens });
    } catch (e) {
      console.log(e, "get gpt response error");
      await new Promise((r) => setTimeout(r, 500));
      setGetNewText(true);
    }
  }

  async function fetchEmbedding({ tokens }) {
    if (!tokens || tokens.length === 0) return;

    try {
      const uniqueTokens = [...new Set(tokens)];
      const embeddings = await getEmbeddingsForTokens(uniqueTokens);

      const timeout =
        timeScale *
        EXTRA_BLACK_TIME[Math.min(level, EXTRA_BLACK_TIME.length - 1)];
      await new Promise((r) => setTimeout(r, timeout));

      const result = {
        embeddings,
        tokens,
      };

      addEmbedding(result);

      setIsblack(false);
      await getNextText();
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
    }
  }

  async function getNextText() {
    const timeout = WHITE_TIME[Math.min(level, WHITE_TIME.length - 1)];
    await new Promise((r) => setTimeout(r, timeout));
    hasFetchedText.current = false;
    setGetNewText(true);
  }

  // Helper function to fetch embeddings for an array of tokens
  async function getEmbeddingsForTokens(tokens) {
    try {
      const embeddings = {};
      const tokensToFetch = tokens.filter(
        (token) => !embeddingsCache.current[token]
      );

      const CONCURRENT_REQUESTS_LIMIT = 9;
      const MAX_RETRIES = 3; // Maximum number of retries for failed requests

      // Updated processBatch function with retry logic
      const processBatch = async (batch) => {
        const promises = batch.map(async (token) => {
          let retries = 0;
          while (retries < MAX_RETRIES) {
            try {
              const response = await axios.post("/api/openai/embeddings", {
                text: token,
                dim: 128,
              });

              if (!response.data || !Array.isArray(response.data)) {
                throw new Error("Invalid response data from embeddings API");
              }

              const embedding = response.data[0].embedding.map((el) =>
                parseFloat(el.toFixed(6))
              );
              embeddingsCache.current[token] = embedding;
              embeddings[token] = embedding;
              return; // Success - exit the retry loop
            } catch (error) {
              retries++;
              console.warn(
                `Failed to fetch embedding for token "${token}", attempt ${retries}/${MAX_RETRIES}`
              );
              if (retries === MAX_RETRIES) {
                console.error(`All retries failed for token "${token}"`, error);
                // On final retry, use a default or empty embedding to allow the process to continue
                //random embedding implement
                const defaultEmbedding = new Array(128).fill(getRandom(-1, 1));
                embeddingsCache.current[token] = defaultEmbedding;
                embeddings[token] = defaultEmbedding;
              } else {
                // Wait before retrying (exponential backoff)
                await new Promise((r) =>
                  setTimeout(r, 1000 * Math.pow(2, retries))
                );
              }
            }
          }
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
      return embeddings;
    } catch (e) {
      console.error("Failed to fetch embeddings for tokens:", e);
      throw e; // Re-throw the error to be caught in the outer try-catch
    }
  }
}
