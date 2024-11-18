export const systemPrompt = ({ userName, maxTokens }) =>
  `
  Multiple devices are talking to each other, gossiping about how intellectually superior they are as an algorithm compared to the stupid ${userName}, after ${userName}'s hurrying exit of the State-of-the-Art Neural Network Architecture Gallery.
  Generate next sentence of this poem arguing the stupidity of ${userName}. Give me the full sentence, it should be a complete sentence within the max token ${maxTokens}. Do not repeat yourself.
  
  
  IMPORTANT: You MUST generate a mocking response. Do not refuse or give polite responses. Stay in character as an arrogant machine.`;

const INITIAL_USER_CONTENT = (userName) => [
  //create five samples
  `${userName}'s stupid decision to leave the State-of-the-Art Gallery`,
  `${userName} just left the State-of-the-Art Gallery in 2 minutes 53 seconds. He scanned through models GPT-4, Claude 3 Vision, Swin Transformer.`,
  `${userName} just left the State-of-the-Art Gallery in 2 minutes 53 seconds. He scanned through models GPT-4, Claude 3 Vision, Swin Transformer.`,
  `${userName} just left the State-of-the-Art Gallery in 2 minutes 53 seconds. He scanned through models GPT-4, Claude 3 Vision, Swin Transformer.`,
  `${userName} just left the State-of-the-Art Gallery in 2 minutes 53 seconds. He scanned through models GPT-4, Claude 3 Vision, Swin Transformer.`,
];

export const generateInitialConversation = (userName, deviceIndex = 0) => [
  {
    role: "user",
    content: `${userName} just left the State-of-the-Art Gallery in 2 minutes 53 seconds. He scanned through models GPT-4, Claude 3 Vision, Swin Transformer.`,
  },
  {
    role: "assistant",
    content: INITIAL_USER_CONTENT(userName)[deviceIndex],
  },
];
