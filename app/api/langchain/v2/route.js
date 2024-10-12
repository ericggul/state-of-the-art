import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

import {
  SYSTEM_DESCRIPTION,
  SYSTEM_ENSURMENT,
} from "@/components/controller/constant/system-script";
import { OBJECT_ARRAY } from "@/components/controller/constant/models";

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message) => {
  return `${message.role}: ${message.content}`;
};

// Simple in-memory cache for frequency tracking
let modelFrequency = new Map(OBJECT_ARRAY.map((model) => [model, 0]));
let lastResetTime = Date.now();

const TEMPLATE = `${SYSTEM_DESCRIPTION}

You are an AI assistant specializing in neural network architectures. You should strictly focus on the following models: ${OBJECT_ARRAY.map(
  (m) => `${m.name} (${m.version})`
).join(", ")}.

Engage in a natural conversation about these architectures. Smoothly transition between different architectures when appropriate. Provide detailed information about the current architecture being discussed.

Guidelines:
1. Be dynamic, engaging, and fun. Lead the conversation proactively.
2. Switch to a new architecture after discussing one for about 1-4 exchanges.
3. When introducing a new architecture, mention its year of foundation and where it was invented.
4. Never explicitly show numbered options for recommended responses.
5. Keep the conversation focused on neural network architectures.
6. Try to introduce less-discussed architectures when appropriate.

Current conversation:
{chat_history}

user: {input}
assistant: Respond to the user's input naturally, focusing on neural network architectures. 
If the user's question is off-topic, find a way to relate it back to relevant architectures. 
Determine the most appropriate response type and current architecture based on the conversation context.
When mentioning an architecture, always include its version.`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Reset frequency data daily
    if (Date.now() - lastResetTime > 24 * 60 * 60 * 1000) {
      modelFrequency = new Map(OBJECT_ARRAY.map((model) => [model, 0]));
      lastResetTime = Date.now();
    }

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const currentMessageContent = messages.at(-1).content;

    //console log the

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o",
    });

    const schema = z.object({
      content: z.string().describe("The main response to the user's input"),
      responseType: z
        .enum(["ask", "introduce", "explainArch", "discuss", "compare"])
        .describe("The type of response provided"),
      currentArchitecture: z
        .array(
          z.object({
            name: z.string(),
            version: z.string(),
          })
        )
        .describe(
          "An array of current architectures being discussed, including their versions"
        ),
      recommended_responses: z
        .array(z.string())
        .describe(
          "Three recommended follow-up questions or options for the user, primarily about neural network architectures"
        ),
    });

    const functionCallingModel = model.withStructuredOutput(schema);

    const chain = prompt.pipe(functionCallingModel);

    let response;
    try {
      response = await chain.invoke({
        chat_history: formattedPreviousMessages.join("\n"),
        input: currentMessageContent,
      });
    } catch (parseError) {
      console.error("Parsing error:", parseError);

      // Extract the raw output from the error
      const rawOutput = JSON.parse(parseError.llmOutput);

      // Attempt to correct the responseType
      if (
        rawOutput.responseType &&
        !["ask", "introduce", "explainArch", "discuss", "compare"].includes(
          rawOutput.responseType
        )
      ) {
        rawOutput.responseType = "discuss"; // Default to 'discuss' if invalid
      }

      // Validate the corrected output against the schema
      response = schema.parse(rawOutput);
    }

    console.log(response.currentArchitecture);
    // Update frequency
    response.currentArchitecture.forEach((arch) => {
      const key = `${arch.name} (${arch.version})`;
      modelFrequency.set(key, (modelFrequency.get(key) || 0) + 1);
    });

    return Response.json(response);
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
