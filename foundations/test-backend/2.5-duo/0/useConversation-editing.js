import axios from "axios";
import { useState, useEffect, useRef } from "react";
import getTTS from "@/foundations/test-backend/utils/getTTS";

const INITIAL_TEXT = `Is AI the brightness for the humanity?`;

export default function useConversation({ conversations, setConversations, setEmbeddings, setIsblack }) {
  const [getNewText, setGetNewText] = useState(true);
  const hasFetchedText = useRef(false);

  // Cache for embeddings
  const embeddingsCache = useRef({});

  useEffect(() => {
    if (getNewText && !hasFetchedText.current) {
      hasFetchedText.current = true;
      fetchText(conversations);
      setIsblack(true);
    }
  }, [getNewText]);

  async function fetchText(conversations) {
    try {
      const text =
        conversations.length < 6
          ? INITIAL_TEXT + conversations.map((el) => el.message.content).join(" ")
          : conversations
              .map((el) => el.message.content)
              .slice(-6)
              .join(" ");

      setGetNewText(false);

      console.log(text);

      const response = await axios.post("/api/openai/gpt-4o-poem", {
        text,
      });

      if (!response.data || !response.data.message.content || !response.data.logprobs.content) {
        throw new Error("No response data or message content");
      }

      setConversations((prev) => [...prev, response.data]);
      console.log(response.data);
      const resultText = response.data.message.content;
      console.log(resultText);
      getTTS({ text: resultText });

      // Extract tokens from response
      const tokens = response.data.logprobs.content.map((el) => el.token);
      fetchEmbedding({ tokens });
    } catch (e) {
      console.log(e, "get gpt response error");
      // Timeout 0.5s
      await new Promise((r) => setTimeout(r, 500));
      setGetNewText(true);
    }
  }

  async function getNextText() {
    await new Promise((r) => setTimeout(r, 1500));
    hasFetchedText.current = false;
    setGetNewText(true);
  }

  async function fetchEmbedding({ tokens }) {
    if (!tokens || tokens.length === 0) return;

    try {
      // Remove duplicates to avoid redundant API calls
      const uniqueTokens = [...new Set(tokens)];

      // Fetch embeddings for unique tokens
      const embeddings = await getEmbeddingsForTokens(uniqueTokens);

      // Build the result object
      const result = {
        embeddings,
        tokens,
      };

      setEmbeddings((ebd) => [...ebd, result]);
      setIsblack(false);

      //after 5s set is black true and
      await getNextText();
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
    }
  }

  const MAX_RETRIES = 5;
  const TIMEOUT = 1000; // 1 second timeout

  async function getEmbeddingsForTokens(tokens) {
    try {
      const embeddings = {};
      const tokensToFetch = tokens.filter((token) => !embeddingsCache.current[token]);
      console.log("tokensToFetch", tokensToFetch);

      const CONCURRENT_REQUESTS_LIMIT = 8;

      const processBatch = async (batch) => {
        console.log("Start processing batch:", batch);
        const promises = batch.map(async (token) => {
          for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
              console.log(`[${new Date().toISOString()}] Attempt ${attempt} for token:`, token);
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

              const response = await axios.post(
                "/api/openai/embeddings",
                {
                  text: token,
                  dim: 256,
                },
                { signal: controller.signal }
              );

              clearTimeout(timeoutId);
              console.log(`[${new Date().toISOString()}] Received API response for token:`, token);

              if (!response.data || !Array.isArray(response.data)) {
                throw new Error("Invalid response data from embeddings API");
              }

              const embedding = response.data[0].embedding.map((el) => parseFloat(el.toFixed(6)));
              embeddingsCache.current[token] = embedding;
              embeddings[token] = embedding;
              return; // Success, exit the retry loop
            } catch (error) {
              if (error.name === "AbortError") {
                console.log(`[${new Date().toISOString()}] Timeout for token: ${token}, attempt ${attempt}`);
              } else {
                console.error(`[${new Date().toISOString()}] Error processing token: ${token}, attempt ${attempt}`, error);
              }
              if (attempt === MAX_RETRIES) {
                console.error(`Failed to process token after all retries: ${token}`);
                embeddingsCache.current[token] = null;
                embeddings[token] = null;
              }
            }
          }
        });

        try {
          await Promise.all(promises);
        } catch (error) {
          console.error("Error in Promise.all:", error);
        }
        console.log("Finished processing batch:", batch);
      };

      const batches = [];
      for (let i = 0; i < tokensToFetch.length; i += CONCURRENT_REQUESTS_LIMIT) {
        batches.push(tokensToFetch.slice(i, i + CONCURRENT_REQUESTS_LIMIT));
      }

      for (const batch of batches) {
        console.log("Processing batch:", batch);
        await processBatch(batch);
      }

      // Add cached embeddings to the result
      for (const token of tokens) {
        if (embeddingsCache.current[token]) {
          embeddings[token] = embeddingsCache.current[token];
        }
      }

      console.log("Final embeddings:", Object.keys(embeddings));
      return embeddings;
    } catch (e) {
      console.error("Failed to fetch embeddings for tokens:", e);
      throw e;
    }
  }

  // async function getEmbeddingsForTokens(tokens) {
  //   try {
  //     const embeddings = {};

  //     // Tokens that need to be fetched (not in cache)
  //     const tokensToFetch = tokens.filter((token) => !embeddingsCache.current[token]);
  //     console.log("tokensToFetch", tokensToFetch);
  //     // Limit the number of concurrent requests to prevent rate limiting
  //     const CONCURRENT_REQUESTS_LIMIT = 16;

  //     // Function to process tokens in batches
  //     const processBatch = async (batch) => {
  //       const promises = batch.map(async (token) => {
  //         console.log("token", token);
  //         const response = await axios.post("/api/openai/embeddings", {
  //           text: token,
  //           dim: 256,
  //         });
  //         console.log("111", response);

  //         if (!response.data || !Array.isArray(response.data)) {
  //           throw new Error("Invalid response data from embeddings API");
  //         }

  //         // Store the embedding in cache and in the embeddings object
  //         const embedding = response.data[0].embedding.map((el) => parseFloat(el.toFixed(6)));
  //         embeddingsCache.current[token] = embedding;
  //         embeddings[token] = embedding;
  //       });

  //       await Promise.all(promises);
  //     };

  //     // Split tokens into batches based on the concurrency limit
  //     const batches = [];
  //     for (let i = 0; i < tokensToFetch.length; i += CONCURRENT_REQUESTS_LIMIT) {
  //       batches.push(tokensToFetch.slice(i, i + CONCURRENT_REQUESTS_LIMIT));
  //     }

  //     // Process each batch sequentially
  //     for (const batch of batches) {
  //       console.log("batch", batch);
  //       await processBatch(batch);
  //     }

  //     // Add cached embeddings to the result
  //     for (const token of tokens) {
  //       if (embeddingsCache.current[token]) {
  //         embeddings[token] = embeddingsCache.current[token];
  //       }
  //     }
  //     return embeddings;
  //   } catch (e) {
  //     console.error("Failed to fetch embeddings for tokens:", e);
  //     throw e; // Re-throw the error to be caught in the outer try-catch
  //   }
  // }
}
