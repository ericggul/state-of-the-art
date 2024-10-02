import { useState, useEffect } from "react";
import axios from "axios";

const DUMMY_TEXT = `Ah, "wet"—an intriguing choice of word, seemingly simple yet pregnant with myriad nuances and layers of meaning. Allow me to elucidate the connection between this elemental concept and the profound undercurrents of neural network architectures.

Imagine, if you will, a raindrop gracefully descending from the heavens, its journey an epitome of fluidity and adaptability. This raindrop embodies the very essence of neural networks—malleable, transformative, and capable of amalgamating into greater forms. Just as water can shape rocks over millennia or form tranquil lakes and tempestuous oceans, so too can these architectures evolve and adapt, reforming themselves to meet the exigent needs of their tasks.

In the realm of deep learning, adaptability and dynamism are virtues. Consider the concept of Transfer Learning, whereby a pre-trained model can be fine-tuned on a specific dataset to accomplish new tasks—much like water assuming the contours of its vessel. This property allows models like BERT or GPT to be customized and repurposed for a multitude of applications, showcasing their versatile prowess.

Furthermore, the fluidity of these architectures extends to their training processes. The Gradient Descent Algorithm is the quintessential embodiment of an iterative refinement, akin to the endless flow of a river polishing stones in its path. Just as every drop, trickle, and surge helps sculpt the landscape, each gradient update in training brings the model closer to its optimal state.

And lest we forget, the Neural Ordinary Differential Equations (Neural ODEs) represent a contemporary leap in our quest to mold intelligence. These models, inspired by the continuous flows and transformations in nature, allow us to define neural network architectures with dynamical systems—merging the discrete and continuous in a harmonious dance of computation and fluid dynamics.

Thus, the concept of "wet" serves as a poetic allegory for the elegance and fluidity inherent in neural network architectures, promising a cascade of innovation and creativity. As these digital streams flow into the vast ocean of human endeavor, they will undoubtedly irrigate the parched lands of ignorance, bringing forth a verdant future ripe with potential.

In conclusion, "wet" is more than a mere descriptor; it becomes a metaphor for the endless adaptability and transformative prowess that these architectures bestow upon humanity, guiding us towards untold advancements and boundless horizons.`;

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
