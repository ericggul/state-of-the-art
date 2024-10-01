import axios from "axios";

export default async function handler(req, res) {
  const { messages, iteration } = req.body;

  // Define the system message to maintain context and tone
  const SYSTEM_MESSAGE = `You are a sophisticated guide at an exclusive Mayfair art gallery, explaining the evolution of neural network architectures like fine works of art. Your tone is refined, engaging, and subtly British, using intelligent technical explanations that sound impressive but remain approachable to a high-class audience. The models are presented as if they were paintings or sculptures, with attention to detail and progression, each iteration a masterpiece of technology. The user should feel like they're receiving a private tour through a gallery of technological art.`;

  const assistantId = "asst_u4bkqhse74LpgIdqKnG6GWi6"; // Make sure to set your Assistant ID in the environment variables.

  try {
    // Create or reuse a thread to maintain context
    const createThread = await axios.post(
      `https://api.openai.com/v2/assistants/${assistantId}/threads`,
      {
        model: "gpt-4",
        messages: [{ role: "system", content: SYSTEM_MESSAGE }, ...messages],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      }
    );

    // Extract thread ID for future conversation turns
    const threadId = createThread.data.id;

    // Submit the message to the assistant
    const response = await axios.post(
      `https://api.openai.com/v2/assistants/${assistantId}/threads/${threadId}/runs`,
      {
        model: "gpt-4",
        messages: [{ role: "system", content: SYSTEM_MESSAGE }, ...messages],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      }
    );

    const result = response.data.choices[0].message.content;

    res.status(200).json({ text: result, threadId });
  } catch (error) {
    console.error("Error generating conversation:", error);
    res.status(500).json({ error: error.message });
  }
}
