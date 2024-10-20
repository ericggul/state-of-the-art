import { useState, useEffect } from "react";
import axios from "axios";

import useScreenStore from "@/components/screen/store";

const DUMMY_TEXT = `Stable Diffusion—where art meets algorithm. At its core, it's a neural network that paints with light and language, transforming text prompts into striking visual dreams. It evolves images iteratively, naturally, powered by latent spaces that unlock infinite artistic potential. Decentralized creativity in the digital agora!
`;

export default function useViseme() {
  const { latestSpeech } = useScreenStore();

  const [visemeMessage, setVisemeMessage] = useState({});

  useEffect(() => {
    if (latestSpeech && latestSpeech.length > 0) {
      getViseme({
        text: latestSpeech,
      });
    }
  }, [latestSpeech]);

  async function getViseme({ text }) {
    try {
      console.log("25", text);
      const audioRes = await axios.post(
        "/api/azure-tts",
        { text },
        { responseType: "blob" }
      );

      console.log("32", audioRes, audioRes.headers.visemes);
      // Get audio as blob
      const audio = audioRes.data; // Since the response is now a blob, it's stored in audioRes.data
      const visemes = JSON.parse(audioRes.headers.visemes); // Use headers to get viseme data

      // Create an audio URL
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      // Set visemes and audio player into message
      let message = {};
      message.visemes = visemes;
      message.audioPlayer = audioPlayer;

      message.audioPlayer.currentTime = 0;
      message.audioPlayer.play();

      // Update state with the message
      console.log("49", message);
      setVisemeMessage(message);
    } catch (e) {
      console.log(e);
    }
  }

  return { visemeMessage };
}
