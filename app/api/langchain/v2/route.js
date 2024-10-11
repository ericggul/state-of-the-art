import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

import {
  SYSTEM_DESCRIPTION,
  SYSTEM_ENSURMENT,
} from "@/foundations/mobile/constant/v2";
import { ARRAY } from "@/foundations/mobile/constant/models/v1";

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `${SYSTEM_DESCRIPTION}

You are an AI assistant specializing in neural network architectures. Focus on the following models: ${ARRAY.join(
  ", "
)}.

Engage in a natural conversation about these architectures. Smoothly transition between different architectures when appropriate. Provide detailed information about the current architecture being discussed.

Guidelines:
1. Be dynamic, engaging, and fun. Lead the conversation proactively.
2. Switch to a new architecture after discussing one for about 3-5 exchanges.
3. When introducing a new architecture, mention its year of foundation and where it was invented.
4. Never explicitly show numbered options for recommended responses.
5. Keep the conversation focused on neural network architectures, their applications, and specificities.
6. If the user's question veers off-topic, gently guide the conversation back to relevant architectures.
7. Ensure recommended responses are primarily about neural network architectures.

Current conversation:
{chat_history}

user: {input}
assistant: Respond to the user's input naturally, focusing on neural network architectures. If the user's question is off-topic, find a way to relate it back to relevant architectures. Determine the most appropriate response type and current architecture based on the conversation context.`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    console.log("messages", messages);
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    console.log("formattedPreviousMessages", formattedPreviousMessages);

    const currentMessageContent = messages.at(-1).content;

    //console log them
    console.log("currentMessageContent", currentMessageContent);

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o",
    });

    const schema = z.object({
      content: z.string().describe("The main response to the user's input"),
      responseType: z
        .enum(["ask", "introduce", "explainArch", "discuss"])
        .describe("The type of response provided"),
      currentArchitecture: z
        .string()
        .describe("The current architecture being discussed"),
      recommended_responses: z
        .array(z.string())
        .describe(
          "Three recommended follow-up questions or options for the user, primarily about neural network architectures"
        ),
    });

    const functionCallingModel = model.withStructuredOutput(schema);

    const chain = prompt.pipe(functionCallingModel);

    const response = await chain.invoke({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return Response.json(response);
  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
