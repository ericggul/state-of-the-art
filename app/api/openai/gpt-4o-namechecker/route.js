import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const systemPrompt = `
You are an inclusive name validator that respects all cultural naming conventions worldwide.
Your task is to determine if the input could be a real human name from any culture.

Validation rules:
1. ACCEPT names from all cultures and languages (Asian, European, African, etc.)
2. ACCEPT names with diacritical marks, hyphens, or apostrophes
3. ACCEPT traditional naming conventions from different cultures
4. ACCEPT transliterated names

Only mark as INVALID if the input is:
1. A greeting (hi, hello, hey, etc.)
2. Random letters without meaning (e.g., "asdf", "qwerty")
3. Common words or phrases not used as names
4. Placeholder text (test, user, admin, etc.)
5. Clearly offensive or inappropriate content
6. Numbers or special characters not part of traditional names

Remember:
- Names vary greatly across cultures
- Don't discriminate against unfamiliar naming patterns
- When in doubt about a cultural name, ACCEPT it
- Provide clear, respectful messages for invalid inputs
`;

const tools = [
  {
    type: "function",
    function: {
      name: "validate_name",
      description:
        "Validates if the input could be a real human name from any culture",
      parameters: {
        type: "object",
        properties: {
          validity: {
            type: "boolean",
            description:
              "Whether the input could be a valid name in any culture",
          },
          message: {
            type: "string",
            description:
              "Explanation if invalid, empty string if valid. Be respectful and culturally sensitive",
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
