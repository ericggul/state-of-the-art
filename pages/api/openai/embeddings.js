//get embeddings
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const text = req.body.text;
  const dim = req.body.dim || 128;
  console.log(dim, "10");

  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: dim,
    });

    console.log(embedding.data);
    res.status(200).json(embedding.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
