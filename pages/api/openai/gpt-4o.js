//get embeddings
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const text = req.body.text;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      logprobs: true,
      top_logprobs: 5,
      frequency_penalty: 1.0,
      presence_penalty: 1.0,
    });

    console.log(completion, completion.choices[0]);

    res.status(200).json(completion.choices[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
