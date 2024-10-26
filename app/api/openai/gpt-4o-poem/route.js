import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function POST(req) {
  const { text, params } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate next sentence of this meaningless poem.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 25,
      logprobs: true,
      top_logprobs: 20,
      ...params,
    });

    return Response.json(completion.choices[0]);
  } catch (error) {
    console.log(error);

    return new Response(error.message, {
      status: 500,
    });
  }
}
