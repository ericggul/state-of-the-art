import OpenAI from "openai";
import { SYSTEM_DESCRIPTION } from "@/foundations/mobile/constant/v1";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function POST(req) {
  const { conversation, nextCommand, requestedNum = 3 } = await req.json();

  try {
    // Build the messages array

    const command = `
    ${SYSTEM_DESCRIPTION}
    As the assistant, your task is to generate ${requestedNum} concise and contextually appropriate user replies that would logically follow in this conversation. These replies should nudge the user towards the following action: ${nextCommand}. Provide these suggestions as a JSON array under the key "suggestions", without any additional text or explanation.
    `;

    const messages = [
      {
        role: "system",
        content: command,
      },
      ...conversation,
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "generate_suggested_responses",
          description: `Generate ${requestedNum} short (Within 5 words) suggested user responses.`,
          parameters: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Array of suggested user responses.",
              },
            },
            required: ["suggestions"],
          },
        },
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools,
      tool_choice: "required",
    });

    const message = completion.choices[0].message;

    let suggestedResponses = [];

    if (
      message.tool_calls &&
      message.tool_calls[0].function.name === "generate_suggested_responses"
    ) {
      // Parse the arguments
      const args = JSON.parse(message.tool_calls[0].function.arguments);
      suggestedResponses = args.suggestions;
    }

    return new Response(JSON.stringify({ suggestions: suggestedResponses }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    return new Response(error.message, {
      status: 500,
    });
  }
}
