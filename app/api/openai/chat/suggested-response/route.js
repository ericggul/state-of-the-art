import OpenAI from "openai";
import { SYSTEM_DESCRIPTION } from "@/foundations/test-frontend/chat/constant";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const SYSTEM_COMMAND = `
${SYSTEM_DESCRIPTION}

As the assistant, your task is to generate 2-3 concise and contextually appropriate user replies that would logically follow in this conversation. Provide these suggestions as a JSON array under the key "suggestions", without any additional text or explanation.
`;

export async function POST(req) {
  const { text } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_COMMAND,
        },
        {
          role: "assistant",
          content: text,
        },
      ],
      tools: [
        {
          type: "function",
          funcion: {
            name: "generate_suggested_responses",
            description: "Generate 2-3 short suggested user responses.",
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
      ],

      tool_choice: "required",
    });

    const message = completion.choices[0].message;
    console.log(message);

    // let suggestedResponses = [];

    // if (message.function_call) {
    //   if (message.function_call.name === "generate_suggested_responses") {
    //     // Parse the arguments
    //     const args = JSON.parse(message.function_call.arguments);
    //     suggestedResponses = args.suggestions;
    //   }
    // }

    return new Response(JSON.stringify({ suggestions: "test" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    return new Response(error.message, {
      status: 500,
    });
  }
}
