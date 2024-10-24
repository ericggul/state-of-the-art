// api.js
export const fetchAssistantResponse = async (conversation) => {
  try {
    const response = await fetch(`/api/openai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  } catch (e) {
    console.error("Error fetching assistant response", e);
    return "Sorry, something went wrong.";
  }
};

export const fetchSuggestedResponses = async (conversation, nextCommand) => {
  try {
    const response = await fetch(`/api/openai/chat/suggested-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation, nextCommand, requestedNum: 3 }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.error("Error fetching suggested responses", e);
    throw e;
  }
};
