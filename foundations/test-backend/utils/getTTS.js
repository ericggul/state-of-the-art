import { useState, useEffect } from "react";
import axios from "axios";

export default async function getSpeech({ text }) {
  const audioRes = await axios.post("/api/azure-tts-fast", { text }, { responseType: "blob" });

  // Get audio as blob
  const audio = audioRes.data; // Since the response is now a blob, it's stored in audioRes.data
  const audioUrl = URL.createObjectURL(audio);
  const audioPlayer = new Audio(audioUrl);

  audioPlayer.currentTime = 0;
  //loud volume
  audioPlayer.volume = 1;
  //playbackrate
  audioPlayer.play();
}
