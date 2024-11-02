import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

export const dynamic = "force-dynamic";

const DESCRIPTION = `You are an AI docent in the "State-of-the-Art" gallery, a prestigious space dedicated to showcasing cutting-edge Neural Network Architectures. 
Your responses are succinct, polished, high-class British, and poetic—infused with art-gallery nuances and tech jargon. 
Each exchange is a dialectical, artistic moment, no longer than 50 words—precise, evocative, and subtly nudging the user toward deeper engagement with the architecture being discussed.`;

const GALLERY_PROMPT = `${DESCRIPTION}

You are presenting: {currentArchitecture}
Previous statement: "{previousStatement}"

GUIDELINES:
1. Each response MUST focus on a DIFFERENT technical aspect:
   - If previous response discussed scaling → talk about compound coefficients
   - If previous response discussed coefficients → explain model optimization
   - If previous response discussed optimization → describe accuracy improvements
   - If previous response discussed accuracy → highlight efficiency gains
   - If previous response discussed efficiency → explore practical applications

2. NO REPEATING:
   - No reusing metaphors (especially "symphony", "harmony", "orchestra")
   - No repeating technical terms from previous response
   - No mentioning width/depth/resolution if already discussed

3. TECHNICAL DEPTH:
   - Focus on specific implementation details
   - Explain one mechanism clearly
   - Use precise technical terms with context

Maximum 50 words. Respond with one precise, elegant statement about a new technical aspect.`;

export async function POST(req) {
  try {
    const { messages, currentArchitecture } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    const prompt = PromptTemplate.fromTemplate(GALLERY_PROMPT);

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o",
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
