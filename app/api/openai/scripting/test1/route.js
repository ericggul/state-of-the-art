import axios from "axios";

export async function handler(req, res) {
  const { messages, iteration } = req.body;

  // Define the system message to maintain context and tone
  const SYSTEM_MESSAGE = `You are a sophisticated guide at an exclusive Mayfair art gallery, explaining the evolution of neural network architectures like fine works of art. Your tone is refined, engaging, and subtly British, using intelligent technical explanations that sound impressive but remain approachable to a high-class audience. The models are presented as if they were paintings or sculptures, with attention to detail and progression, each iteration a masterpiece of technology. The user should feel like they're receiving a private tour through a gallery of technological art.`;

  // Merge user messages with system message
  const editedMessages = [{ role: "system", content: SYSTEM_MESSAGE }, ...messages];

  try {
    // Make the API call to GPT-4
    const completion = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: editedMessages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the result from the API response
    const result = completion.data.choices[0].message.content;

    // Send the generated conversation response back to the client
    res.status(200).json({ text: result });
  } catch (error) {
    console.error("Error generating conversation:", error);
    res.status(500).json({ error: error.message });
  }
}
