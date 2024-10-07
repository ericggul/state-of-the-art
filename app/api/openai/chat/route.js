import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function POST(req) {
  const { conversation } = await req.json(); // Retrieve the conversation from the request body

  try {
    console.log(conversation);
    // Make the API call to OpenAI for non-streaming response
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversation, // Send the entire conversation history
    });

    // Return the full completion response instead of streaming it
    return new Response(JSON.stringify(response.choices[0]), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(error.message, {
      status: 500,
    });
  }
}
