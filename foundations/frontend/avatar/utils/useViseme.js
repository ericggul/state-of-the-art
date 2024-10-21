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
      const audio = audioRes.data;
      const visemes = JSON.parse(audioRes.headers.visemes);

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
      console.error("Error in getViseme:");
      console.error("Error message:", e.message);
      console.error("Error name:", e.name);
      console.error("Error stack:", e.stack);
      if (e.response) {
        console.error("Response status:", e.response.status);
        console.error("Response headers:", e.response.headers);
        // Try to parse the response data if it's JSON
        try {
          const errorData = await e.response.data.text();
          console.error("Response data:", JSON.parse(errorData));
        } catch (parseError) {
          console.error("Response data (unparsed):", e.response.data);
        }
      } else if (e.request) {
        console.error("No response received. Request:", e.request);
      }
      console.error("Error config:", e.config);
    }
  }

  return { visemeMessage };
}
