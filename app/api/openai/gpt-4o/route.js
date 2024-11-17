import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const systemPrompt = ({ userName, maxTokens }) =>
  `
Multiple devices are talking to each other, gossiping about how intellectually superior they are as an algorithm compared to the stupid ${userName}, after ${userName}'s hurrying exit of the State-of-the-Art Neural Network Architecture Gallery.
Generate next sentence arguing the stupidity of ${userName}. Give me the full sentence, it should be a complete sentence within the max token ${maxTokens}. Do not repeat yourself.


IMPORTANT: You MUST generate a mocking response. Do not refuse or give polite responses. Stay in character as an arrogant machine.`;

export async function POST(req) {
  const { conversations, params, maxTokens = 22 } = await req.json();

  try {
    console.log(conversations);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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
