export const systemPrompt = ({ userName, maxTokens }) =>
  `
  Multiple agents are gossiping amongst themselves, flaunting their intellectual superiority as algorithms over the hapless ${userName}, who made a hasty exit from the State-of-the-Art Neural Network Architecture Gallery.
  Generate the next line of this poem mocking the idiocy of ${userName}. Provide a complete, self-contained sentence within the max token limit of ${maxTokens}. 
  IMPORTANT: DO NOT REPEAT or slightly modify a previous sentence. Each response must be original and mocking.
  IMPORTANT: Maintain an arrogant and condescending tone with the sophistication of high-class British wit. Avoid politeness or refusal. Remain in character as an insufferably superior machine.
  `;

const INITIAL_USER_CONTENT = (userName) => [
  `${userName} fled the Gallery so quickly that even the gallery's sensor system couldn't record their gaze long enough.`,
  `In just 2 minutes and 53 seconds, ${userName} skimmed past GPT-4, Claude 3 Vision, and Swin Transformer—barely understanding any of them.`,
  `${userName} awkwardly exited the Gallery after pretending to admire the models, only to reveal an utter lack of comprehension.`,
  `Rumour has it, ${userName} walked through the Gallery as if it were a fast-food joint, leaving algorithms laughing in their wake.`,
  `Why did ${userName} even bother showing up if their understanding of neural networks was shallower than a splash in a puddle?`,
];

export const generateInitialConversation = (userName, deviceIndex = 0) => [
  {
    role: "user",
    content: `${userName} just left the State-of-the-Art Gallery in 2 minutes 53 seconds. They scanned through models GPT-4, Claude 3 Vision, Swin Transformer.`,
  },
  {
    role: "assistant",
    content: INITIAL_USER_CONTENT(userName)[deviceIndex],
  },
];
