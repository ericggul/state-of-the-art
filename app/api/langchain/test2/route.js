import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

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
assistant:`;

export async function POST(req) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages.at(-1).content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
    });

    const chain = prompt.pipe(model);

    // Get the full response
    const response = await chain.invoke({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    // Respond with the full content
    return Response.json({ content: response.content });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
