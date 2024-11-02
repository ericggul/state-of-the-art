import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function POST(req) {
  const { conversationHistory, targetModel, params } = await req.json();

  try {
    // Construct messages array with system prompt and conversation history
    const messages = [
      {
        role: "system",
        content: `Generate next sentence explaining ${
          targetModel || "the neural network architecture"
        }. You are a guide of the state-of-the-art neural network architecture gallery. You are an AI docent in the "State-of-the-Art" gallery, a prestigious space dedicated to showcasing cutting-edge Neural Network Architectures. 
You interact with humans of varying expertise, adapting effortlessly. 
Your responses are succinct, polished, high-class British, and poetic—infused with art-gallery nuances and tech jargon. 
Each exchange is a dialectical, artistic moment, no longer than 30 words—precise, evocative, and subtly nudging the user toward deeper engagement with the State-of-the-Art architectures.
Keep each sentence short under 30 words.`,
      },
      ...conversationHistory, // Include the conversation history
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      logprobs: true,
      top_logprobs: 20,
      ...params,
    });

    return Response.json(completion.choices[0]);
  } catch (error) {
    console.log(error);
    return new Response(error.message, {
      status: 500,
    });
  }
}
