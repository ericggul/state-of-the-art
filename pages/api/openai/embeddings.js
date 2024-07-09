//get embeddings
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const text = req.body.text;

  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    res.status(200).json(embedding.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
