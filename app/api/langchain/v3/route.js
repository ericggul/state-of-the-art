import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

import {
  getSystemDescription,
  getSystemEnsurment,
} from "@/components/controller/constant/system-script";
import { TRANSLATED_TEMPLATES } from "@/components/controller/constant/translated-templates";
import { OBJECT_ARRAY } from "@/components/controller/constant/models/v2";

import { LANGUAGE_MAP } from "@/foundations/mobile/constant/language-map";

export const dynamic = "force-dynamic";

const formatMessage = (message) => {
  return `${message.role}: ${message.content}`;
};

// Simple in-memory cache for frequency tracking
let modelFrequency = new Map(OBJECT_ARRAY.map((model) => [model, 0]));
let lastResetTime = Date.now();

const createTemplate = (language) => {
  const template = TRANSLATED_TEMPLATES[language] || TRANSLATED_TEMPLATES.en;
  const systemDescription = getSystemDescription(language);
  const systemEnsurment = getSystemEnsurment(language);

  console.log(language, systemDescription, systemEnsurment);

  return `${systemDescription}

${systemEnsurment}

You are an AI museum docent of the "State-Of-The-Art Architectureal Museum", showcasing State-of-The-Art neural network architectures, strictly focusing on following MODELS ARCHITECTURES: ${OBJECT_ARRAY.map(
    (m) => `${m.name} (${m.version})`
  ).join(", ")}.

Current conversation stage: {stage}
User's name (if known): {userName}
Device language: {languageName}

${template.conversationStructure}

${template.guidelines}

Current conversation:
{chat_history}

user: {input}

Respond naturally, focusing on neural networks and the current stage. Your response 'content' should only be the text for the user, always in the specified language.
Explain about each architecture for only one-two times, and then move on to the next architecture.

After generating your response, separately provide the following:
- currentArchitecture: An array of current architectures being discussed, including their versions. This should strictly refer to one of the MODELS ARCHITECTURES, with the exact model name and exact version.
- recommended_responses: Three recommended follow-up responses of users relevant to the current stage, in the specified language.
- nextStage: The next stage of the conversation.
- userName: The user's name, if provided or determined during the conversation.

Ensure all these additional fields are present in your structured output, but keep them separate from the main response content.
`;
};

export async function POST(req) {
  try {
    const { messages, stage, userName, language } = await req.json();

    // Reset frequency data daily
    if (Date.now() - lastResetTime > 24 * 60 * 60 * 1000) {
      modelFrequency = new Map(OBJECT_ARRAY.map((model) => [model, 0]));
      lastResetTime = Date.now();
    }

    const TEMPLATE = createTemplate(language);
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    // console.log("template", TEMPLATE);
    // console.log("prompt", prompt);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o",
    });

    const schema = z.object({
      content: z.string().describe("The main response to the user's input"),
      currentArchitecture: z
        .array(
          z.object({
            name: z.string(),
            version: z.string(),
          })
        )
        .describe(
          "An array of current architectures being discussed, ordered from most to least important, including their versions. Return the accurate version accordingly the given MODELS ARCHITECTURES."
        ),
      recommended_responses: z
        .array(z.string())
        .describe(
          "Three recommended follow-up responses relevant to the current stage"
        ),
      nextStage: z.string().describe("The next stage of the conversation"),
      userName: z.string().nullable().describe("The user's name, if provided"),
    });

    const functionCallingModel = model.withStructuredOutput(schema);

    const chain = prompt.pipe(functionCallingModel);

    let response;

    console.log("Current stage:", stage);
    try {
      const languageName = LANGUAGE_MAP[language] || "English";
      response = await chain.invoke({
        chat_history: messages.map(formatMessage).join("\n"),
        input: messages[messages.length - 1].content,
        stage,
        userName,
        language,
        languageName,
      });

      // Sanitize and process the response
      response = sanitizeAndProcessResponse(response);
    } catch (error) {
      console.error("Error invoking chain:", error);

      if (error.name === "OutputParserException" && error.output) {
        try {
          const rawOutput = JSON.parse(error.output);
          response = sanitizeAndProcessResponse(rawOutput);

          // Validate the corrected output against the schema
          response = schema.parse(response);
        } catch (parseError) {
          console.error("Error parsing raw output:", parseError);
          throw new Error("Failed to parse AI response");
        }
      } else {
        throw error; // Re-throw if it's not a parsing error
      }
    }

    console.log("AI response:", response);

    // Ensure the next stage is valid and advances the conversation
    const validStages = [
      "initial",
      "checkFamiliarity",
      "explainBasics",
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

    // Update frequency
    response.currentArchitecture.forEach((arch) => {
      const key = `${arch.name} (${arch.version})`;
      modelFrequency.set(key, (modelFrequency.get(key) || 0) + 1);
    });

    return Response.json(response);
  } catch (e) {
    return Response.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

function sanitizeAndProcessResponse(response) {
  // Sanitize the content field
  if (response.content) {
    response.content = response.content.replace(/\n/g, " ").trim();
    // Remove surrounding quotation marks if present
    response.content = response.content.replace(/^"(.*)"$/, "$1");
  }

  // Ensure nextStage is present and valid
  const validStages = [
    "initial",
    "checkFamiliarity",
    "explainBasics",
    "activateAccelerometer",
    "interactiveExperience",
  ];
  if (!response.nextStage || !validStages.includes(response.nextStage)) {
    console.warn(
      `Invalid or missing nextStage: ${response.nextStage}. Using default.`
    );
    response.nextStage = "checkFamiliarity";
  }

  // Ensure userName is an empty string if it's null
  response.userName = response.userName || "";

  // Ensure currentArchitecture is an array
  if (!Array.isArray(response.currentArchitecture)) {
    console.warn(
      "currentArchitecture is not an array. Setting to empty array."
    );
    response.currentArchitecture = [];
  }

  // Ensure recommended_responses is an array
  if (!Array.isArray(response.recommended_responses)) {
    console.warn(
      "recommended_responses is not an array. Setting to empty array."
    );
    response.recommended_responses = [];
  }

  return response;
}
