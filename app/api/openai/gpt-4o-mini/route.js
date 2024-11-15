import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function POST(req) {
  const { text, params, maxTokens = 22 } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Generate next sentence arguing the stupidity of ${params.userName}. Give me the full sentence, it should be a complete sentence within the max token ${maxTokens}. Mention the name ${params.userName} explicitly.`,
        },
        {
          role: "user",
          content: text,
        },
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
