import axios from "axios";
import { useState, useEffect, useRef } from "react";

const INITIAL_TEXT = `Is AI the brightness for the humanity?`;

export default function useConversation({ conversations, setConversations, setEmbeddings, setIsblack }) {
  const [isFetching, setIsFetching] = useState(true);
  const embeddingsCache = useRef({});

  useEffect(() => {
    let isMounted = true;

    async function fetchAndProcessConversation() {
      if (!isMounted) return;
      setIsblack(true);

      try {
        // Build text from conversations
        const conversationTexts = conversations.map((el) => el.message.content);
        let text;

        if (conversations.length < 10) {
          text = INITIAL_TEXT + conversationTexts.join(" ");
        } else {
          text = conversationTexts.slice(-10).join(" ");
        }

        console.log("Fetching text:", text);

        const response = await axios.post("/api/openai/gpt-4o-poem", {
          text,
        });

        if (!response.data || !response.data.message.content || !response.data.logprobs.content) {
          throw new Error("No response data or message content");
        }

        if (!isMounted) return;

        setConversations((prev) => [...prev, response.data]);
        const tokens = response.data.logprobs.content.map((el) => el.token);

        // Await the embeddings to ensure proper sequencing
        await fetchEmbedding({ tokens, isMounted });

        if (!isMounted) return;

        setIsblack(false);

        // Wait before fetching the next text
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (!isMounted) return;

        setIsFetching(true);
      } catch (e) {
        console.error(e, "Error fetching conversation");

        // Retry after a delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!isMounted) return;

        setIsFetching(true);
      }
    }

    if (isFetching) {
      setIsFetching(false);
      fetchAndProcessConversation();
    }

    return () => {
      isMounted = false;
    };
  }, [isFetching, conversations]);

  async function fetchEmbedding({ tokens, isMounted }) {
    if (!tokens || tokens.length === 0) return;

    try {
      // Remove duplicates
      const uniqueTokens = [...new Set(tokens)];

      // Fetch embeddings for unique tokens
      const embeddings = await getEmbeddingsForTokens(uniqueTokens, isMounted);

      if (!isMounted) return;

      // Build the result object
      const result = {
        embeddings,
        tokens,
      };

      setEmbeddings((prev) => [...prev, result]);
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
    }
  }

  async function getEmbeddingsForTokens(tokens, isMounted) {
    const embeddings = {};
    const tokensToFetch = tokens.filter((token) => !embeddingsCache.current[token]);

    const CONCURRENT_REQUESTS_LIMIT = 8;

    // Process tokens in batches to respect the concurrency limit
    for (let i = 0; i < tokensToFetch.length; i += CONCURRENT_REQUESTS_LIMIT) {
      const batch = tokensToFetch.slice(i, i + CONCURRENT_REQUESTS_LIMIT);

      const promises = batch.map(async (token) => {
        try {
          const response = await axios.post("/api/openai/embeddings", {
            text: token,
            dim: 256,
          });

          if (!response.data || !Array.isArray(response.data)) {
            throw new Error("Invalid response data from embeddings API");
          }

          const embedding = response.data[0].embedding.map((el) => parseFloat(el.toFixed(6)));
          embeddingsCache.current[token] = embedding;
          embeddings[token] = embedding;
        } catch (e) {
          console.error(`Error fetching embedding for token "${token}":`, e);
          // Optionally, you can implement a retry mechanism here
        }
      });

      await Promise.all(promises);

      if (!isMounted) return;
    }

    // Add cached embeddings to the result
    tokens.forEach((token) => {
      if (embeddingsCache.current[token]) {
        embeddings[token] = embeddingsCache.current[token];
      }
    });

    return embeddings;
  }
}
