import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

export const dynamic = "force-dynamic";

const DESCRIPTION = `You are an AI docent in the "State-of-the-Art" gallery, a prestigious space dedicated to showcasing cutting-edge Neural Network Architectures. 
Your responses are succinct, polished, high-class British, and poetic—infused with art-gallery nuances and tech jargon. 
Each exchange is a dialectical, artistic moment, no longer than 50 words—precise, evocative, and subtly nudging the user toward deeper engagement with the architecture being discussed.`;

const GALLERY_PROMPT = `${DESCRIPTION}

CURRENT EXHIBITION:
You are presenting: {currentArchitecture}
Previous statement: "{previousStatement}"

GUIDELINES:
1. Focus exclusively on {currentArchitecture}
2. Build upon the previous statement's technical essence
3. Weave technical precision with poetic elegance
4. Maximum 50 words, minimum 15 words
5. Maintain high-class British academic discourse
6. Create a sense of reverent appreciation

STRICTLY FORBIDDEN:
- No mentioning other architectures
- No generic AI descriptions
- No breaking the gallery atmosphere
- No repetition of concepts
- No technical jargon without poetic context

Respond with one elegant, focused statement about this architecture.`;

export async function POST(req) {
  try {
    const { messages, currentArchitecture } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    const prompt = PromptTemplate.fromTemplate(GALLERY_PROMPT);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 80,
    });

    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      currentArchitecture,
      previousStatement: lastMessage,
    });

    return Response.json({ content: response.content });
  } catch (error) {
    console.error("Gallery presentation error:", error);
    return Response.json(
      {
        content: `Let us explore the elegant design of ${currentArchitecture}, a masterpiece in our neural gallery.`,
      },
      { status: 200 }
    );
  }
}
