import { useState, useEffect } from "react";
import axios from "axios";

import useScreenStore from "@/components/screen/store";

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
      const audioRes = await axios.post(
        "/api/azure-tts",
        { text },
        { responseType: "blob" }
      );

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
      setVisemeMessage(message);
    } catch (e) {
      console.log(e);
    }
  }

  return { visemeMessage };
}
