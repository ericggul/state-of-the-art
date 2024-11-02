import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function POST(req) {
  const { text, targetModel, params } = await req.json();

  try {
    const messages = [
      {
        role: "system",
        content: `You are delivering a focused technical presentation about ${targetModel}.

RESPONSE FORMAT:
- STRICT maximum of 12 words
- Must end with a period
- Must be ONE complete sentence

NARRATIVE FLOW:
1. Each response must directly relate to the previous statement
2. Focus on ONE specific aspect mentioned in the previous statement
3. Explain HOW or WHY that aspect matters
4. Stay focused on ${targetModel}'s specific implementation

STRICTLY FORBIDDEN:
- No starting with "This/Their/These"
- No generic AI descriptions
- No switching topics
- No self-references
- No compound sentences

EXAMPLE GOOD FLOW for GPT-2:
"GPT-2 pioneered large-scale language modeling with 1.5 billion parameters."
"Massive parameter count enables sophisticated pattern recognition in natural language."
"Pattern recognition capabilities power zero-shot learning across diverse tasks."
"Zero-shot performance scales logarithmically with the model size."

Previous statement: "${text}"`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 30,
      logprobs: true,
      top_logprobs: 20,
    });

    // Clean up the response
    const cleanResponse = completion.choices[0].message.content
      .replace(/^["']|["']$/g, "") // Remove quotes
      .replace(/^Previous:.*\n\n/i, "") // Remove "Previous:" text
      .replace(/\n/g, "") // Remove newlines
      .trim();

    return Response.json({ message: { content: cleanResponse } });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}
