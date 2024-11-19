import OpenAI from "openai";
import { systemPrompt } from "@/utils/constant/conversation";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function POST(req) {
  const { conversations, params, maxTokens = 22 } = await req.json();

  try {
    console.log(conversations);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt({ userName: params.userName, maxTokens }),
        },
        ...conversations,
      ],
      max_tokens: maxTokens + 5,
      logprobs: true,
      top_logprobs: 20,
      temperature: params.temperature,
    });

    return Response.json(completion.choices[0]);
  } catch (error) {
    console.log(error);
    return new Response(error.message, {
      status: 500,
    });
  }
}
