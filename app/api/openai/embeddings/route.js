//get embeddings
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function POST(req) {
  const { text, dim = 128 } = await req.json();

  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: dim,
    });

    return Response.json(embedding.data);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
