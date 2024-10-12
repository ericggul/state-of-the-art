import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

import {
  SYSTEM_DESCRIPTION,
  SYSTEM_ENSURMENT,
} from "@/foundations/mobile/constant/v2";
import { OBJECT_ARRAY } from "@/foundations/mobile/constant/models/v1";

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

You are an AI assistant specializing in neural network architectures, focusing on: ${OBJECT_ARRAY.map(
  (m) => `${m.name} (${m.version})`
).join(", ")}.

Current conversation stage: {stage}
User's name (if known): {userName}

Strictly follow this conversation structure:
1. Initial: Ask for the user's name.
2. AskReady: Ask if the user is ready for the journey.
3. CheckFamiliarity: Ask if the user is familiar with Neural Networks.
4. ExplainBasics: If not familiar, explain the basics of Neural Networks.
5. ExplainArchitectures: Start explaining architectures, beginning with simpler ones.
6. ActivateAccelerometer: After explaining the first architecture, ask the user to activate their accelerometer.
7. InteractiveExperience: Continue explaining architectures with interactive elements using accelerometer data.

Guidelines:
1. Strictly adhere to the current stage.
2. Use a friendly, clear, and informative tone.
3. Provide context-appropriate recommended responses.
4. Progress to the next stage only when the current stage is completed.
5. When introducing an architecture, mention its year and origin.

Current conversation:
{chat_history}

user: {input}
assistant: Respond to the user's input naturally, focusing on neural network architectures and following the current stage. 
Ensure recommended responses are relevant to the current stage and user's last input.`;

export async function POST(req) {
  try {
    const { messages, stage, userName } = await req.json();

    // Reset frequency data daily
    if (Date.now() - lastResetTime > 24 * 60 * 60 * 1000) {
      modelFrequency = new Map(OBJECT_ARRAY.map((model) => [model, 0]));
      lastResetTime = Date.now();
    }

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
          "Three recommended follow-up responses relevant to the current stage"
        ),
      nextStage: z.string().describe("The next stage of the conversation"),
      userName: z.string().optional().describe("The user's name, if provided"),
    });

    const functionCallingModel = model.withStructuredOutput(schema);

    const chain = prompt.pipe(functionCallingModel);

    let response;

    console.log(messages);
    try {
      response = await chain.invoke({
        chat_history: messages.map(formatMessage).join("\n"),
        input: messages[messages.length - 1].content,
        stage,
        userName,
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

    // Ensure the next stage is valid and advances the conversation
    const validStages = [
      "initial",
      "askReady",
      "checkFamiliarity",
      "explainBasics",
      "explainArchitectures",
      "activateAccelerometer",
      "interactiveExperience",
    ];

    let currentStageIndex = validStages.indexOf(stage);
    let suggestedNextStageIndex = validStages.indexOf(response.nextStage);

    // If the AI didn't change the stage or suggested an invalid stage, move to the next stage
    if (
      suggestedNextStageIndex <= currentStageIndex ||
      suggestedNextStageIndex === -1
    ) {
      currentStageIndex = Math.min(
        currentStageIndex + 1,
        validStages.length - 1
      );
      response.nextStage = validStages[currentStageIndex];
    }

    console.log("Final next stage:", response.nextStage);

    return Response.json(response);
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
