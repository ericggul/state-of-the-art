import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function POST(req) {
  const { conversation } = await req.json(); // Retrieve the conversation from the request body

  console.log(conversation);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversation, // Send the entire conversation history
      stream: true, // Enable streaming
    });

    const encoder = new TextEncoder();

    // Create a ReadableStream to handle streaming data
    const stream = new ReadableStream({
      async start(controller) {
        for await (const part of response) {
          const content = part.choices[0].delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(error.message, {
      status: 500,
    });
  }
}
