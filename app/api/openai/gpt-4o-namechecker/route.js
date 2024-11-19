import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const systemPrompt = `
You are a strict name validator. Your task is to determine if the given input is a real human name.
You must respond with a structured output containing validity and a message.

Rules for validation:
1. Invalid if it's a greeting (hi, hello, hey, etc.)
2. Invalid if it contains random letters
3. Invalid if it's a common word or phrase
4. Invalid if it's placeholder text
5. Invalid if it contains numbers or special characters
6. Invalid if it's too short or generic
7. Invalid if it's not a plausible human name

Be very strict in validation. When in doubt, mark as invalid.
`;

const tools = [
  {
    type: "function",
    function: {
      name: "validate_name",
      description: "Validates if the input is a real human name",
      parameters: {
        type: "object",
        properties: {
          validity: {
            type: "boolean",
            description: "Whether the input is a valid name",
          },
          message: {
            type: "string",
            description:
              "Explanation message when invalid, empty string when valid",
          },
        },
        required: ["validity", "message"],
      },
    },
  },
];

export async function POST(req) {
  const { text } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: text.trim(),
        },
      ],
      tools,
      tool_choice: "required",
      temperature: 0.1,
    });

    const message = completion.choices[0].message;

    if (
      message.tool_calls &&
      message.tool_calls[0].function.name === "validate_name"
    ) {
      const response = JSON.parse(message.tool_calls[0].function.arguments);
      return Response.json(response);
    }

    throw new Error("Invalid response format from GPT");
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        validity: false,
        message: "Error validating name. Please try again.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
