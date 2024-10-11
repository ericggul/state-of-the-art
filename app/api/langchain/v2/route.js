import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

import {
  SYSTEM_DESCRIPTION,
  SYSTEM_ENSURMENT,
  SYSTEM_SCRIPT,
} from "@/foundations/mobile/constant";
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

${SYSTEM_ENSURMENT}

You are an AI assistant specializing in neural network architectures. Focus on the following models: ${ARRAY.join(
  ", "
)}.

Engage in a natural conversation about these architectures. Smoothly transition between different architectures when appropriate. Provide detailed information about the current architecture being discussed.

Current conversation:
{chat_history}

user: {input}
assistant: Respond to the user's input naturally, focusing on neural network architectures. Determine the most appropriate response type and current architecture based on the conversation context.`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages.at(-1).content;

    //console log them
    console.log("formattedPreviousMessages", formattedPreviousMessages);
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
          "Three recommended follow-up questions or options for the user"
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
