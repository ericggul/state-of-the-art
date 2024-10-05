import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// You can set these as environment variables too
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
const MAX_RETRIES = 10;
const RETRY_DELAY = 1000;

export async function POST(request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // Poll for the run completion
    let runStatus = await pollRunStatus(thread.id, run.id);

    if (runStatus.status === "completed") {
      // Get the messages
      const messages = await openai.beta.threads.messages.list(thread.id);

      // Get the last assistant message
      const lastMessage = messages.data.filter((message) => message.role === "assistant").pop();

      if (!lastMessage) {
        return NextResponse.json({ error: "No response from assistant" }, { status: 500 });
      }

      // Clean up - delete the thread
      await openai.beta.threads.del(thread.id);

      return NextResponse.json({
        message: lastMessage.content[0].text.value,
      });
    } else {
      // If the run failed or expired
      return NextResponse.json({ error: `Run ended with status: ${runStatus.status}` }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in assistant route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to poll the run status
async function pollRunStatus(threadId, runId) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (run.status === "completed" || run.status === "failed" || run.status === "expired") {
      return run;
    }

    if (run.status === "requires_action") {
      // Handle function calls if your assistant uses them
      // This is a simplified example - you might need more complex handling
      // depending on your assistant's configuration
      return run;
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    retries++;
  }

  throw new Error("Run polling timed out");
}

// Optional: Add a GET handler if you need to retrieve thread history
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId");

  if (!threadId) {
    return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
  }

  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    return NextResponse.json({ messages: messages.data });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
