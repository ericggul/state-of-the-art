//get embeddings
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Ensure UTF-8 encoding
  req.setEncoding("utf8");

  const text = req.body.text;
  const params = req.body.params;

  console.log("15", text);
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Generate next sentence of this poem.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 30,
      logprobs: true,
      top_logprobs: 20,
      ...params,
    });

    res.status(200).json(completion.choices[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
