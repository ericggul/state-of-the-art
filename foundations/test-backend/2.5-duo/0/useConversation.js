import axios from "axios";
import { useState, useEffect, useRef } from "react";

const INITIAL_TEXT = `Is AI the brightness for the future of humanity? Or is it the darkness? `;

export default function useConvesation({ conversations, setConversations }) {
  const [getNewText, setGetNewText] = useState(true);
  const hasFetchedText = useRef(false); // Add this line

  useEffect(() => {
    if (getNewText && !hasFetchedText.current) {
      hasFetchedText.current = true;
      fetchText(conversations);
    }
  }, [getNewText]);

  async function fetchText(conversations) {
    try {
      const text = INITIAL_TEXT + conversations.map((el) => el.message.content).join(" ");
      setGetNewText(false);
      console.log(text);

      const response = await axios.post("/api/openai/gpt-4o", {
        text,
      });

      //timeout 2s
      await new Promise((r) => setTimeout(r, 2000));
      setConversations((prev) => [...prev, response.data]);
      //wait for another 5s
      await new Promise((r) => setTimeout(r, 5000));
      hasFetchedText.current = false;
      setGetNewText(true);
    } catch (e) {
      console.log(e, "get gpt response error");
      //timeout 0.5s
      await new Promise((r) => setTimeout(r, 500));
      setGetNewText(true);
    }
  }

  console.log(conversations);

  async function fetchEmbedding(text) {
    if (!text) return;

    try {
      const res = await axios.post("/api/openai/embeddings", {
        text,
        dim: 256,
      });

      setEmbeddings((prevEmbeddings) => {
        const newEmbedding = res.data[0].embedding.map((el) => parseFloat(el.toFixed(6)));
        return {
          ...prevEmbeddings,
          [text]: {
            pos: newEmbedding
              .filter((a) => a > 0)
              .sort((a, b) => b - a)
              .slice(0, 20),
            neg: newEmbedding
              .filter((a) => a < 0)
              .sort((a, b) => a - b)
              .slice(0, 20)
              .reverse(),
          },
        };
      });
    } catch (e) {
      console.error("Failed to fetch embeddings:", e);
    }
  }
}
