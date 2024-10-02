import { useState, useEffect } from "react";
import axios from "axios";

const DUMMY_TEXT = `Splendid! Onto our next masterpiece then, the Multi-Layer Perceptron (MLP). Imagine this as a sophisticated expansion on the humble perceptron, akin to an intricate Baroque sculpture emerging from a simple stone. Introduced in the 1980s, the MLP consists of multiple layers of neurons—input, hidden, and output layers—each interconnected with weighted synapses.

This architecture facilitated the learning of more complex patterns and features through what we call backpropagation—a method for training these deep networks by minimizing errors between predicted and actual outcomes. It's a seminal work of art that paved the way for more profound and intricate structures.

Shall we proceed to the exquisite piece known as the Convolutional Neural Network (CNN), often revered for its prowess in visual artistry, or do you have any questions about the MLP?`;

export default function useViseme() {
  const [tempMessage, setTempMessage] = useState({});

  useEffect(() => {
    getViseme();
  }, []);

  async function getViseme() {
    const text = DUMMY_TEXT;

    const audioRes = await axios.post("/api/azure-tts", { text }, { responseType: "blob" });

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
    setTempMessage(message);
  }

  return { tempMessage };
}
