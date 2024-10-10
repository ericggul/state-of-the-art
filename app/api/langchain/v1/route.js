import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

import {
  SYSTEM_DESCRIPTION,
  SYSTEM_ENSURMENT,
  SYSTEM_SCRIPT,
} from "@/foundations/mobile/constant";

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `${SYSTEM_DESCRIPTION}

Current conversation:
{chat_history}

user: {input}
assistant: Provide a response to the user's input and suggest three recommended follow-up messages.`;

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
      recommended_responses: z
        .array(z.string())
        .describe("Three recommended follow-up messages for the user"),
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
