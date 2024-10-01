import axios from "axios";
import { useState, useEffect, useRef } from "react";

const INITIAL_TEXT = `Is AI the brightness for the future of humanity? Or is it the darkness? `;

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
              .join(" ")
              .slice(-6);
      setGetNewText(false);

      const response = await axios.post("/api/openai/gpt-4o-poem", {
        text,
      });

      if (!response.data || !response.data.message.content || !response.data.logprobs.content) {
        throw new Error("No response data or message content");
      }

      setConversations((prev) => [...prev, response.data]);

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

  // Helper function to fetch embeddings for an array of tokens
  async function getEmbeddingsForTokens(tokens) {
    try {
      const embeddings = {};

      // Tokens that need to be fetched (not in cache)
      const tokensToFetch = tokens.filter((token) => !embeddingsCache.current[token]);

      // Limit the number of concurrent requests to prevent rate limiting
      const CONCURRENT_REQUESTS_LIMIT = 8;

      // Function to process tokens in batches
      const processBatch = async (batch) => {
        const promises = batch.map(async (token) => {
          const response = await axios.post("/api/openai/embeddings", {
            text: token,
            dim: 256,
          });

          if (!response.data || !Array.isArray(response.data)) {
            throw new Error("Invalid response data from embeddings API");
          }

          // Store the embedding in cache and in the embeddings object
          const embedding = response.data[0].embedding.map((el) => parseFloat(el.toFixed(6)));
          embeddingsCache.current[token] = embedding;
          embeddings[token] = embedding;
        });

        await Promise.all(promises);
      };

      // Split tokens into batches based on the concurrency limit
      const batches = [];
      for (let i = 0; i < tokensToFetch.length; i += CONCURRENT_REQUESTS_LIMIT) {
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
