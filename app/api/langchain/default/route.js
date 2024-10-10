import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();
    const message = messages.at(-1).content;

    const prompt = PromptTemplate.fromTemplate("{message}");

    const model = new ChatOpenAI({
      apiKey: process.env["OPENAI_API_KEY"],
      model: "gpt-4", // Changed from 'gpt-4o' to 'gpt-4'
    });

    const chain = prompt.pipe(model);

    // Get the full response
    const response = await chain.invoke({ message });

    // Respond with the full content
    return Response.json({ content: response.content });
  } catch (e) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
