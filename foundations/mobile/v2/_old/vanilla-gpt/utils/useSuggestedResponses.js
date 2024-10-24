// useSuggestedResponses.js
import { useState } from "react";
import { fetchSuggestedResponses } from "./api";

export const useSuggestedResponses = (currentStep, sendMessage) => {
  const [suggestedResponses, setSuggestedResponses] = useState([]);

  const updateSuggestedResponses = async (conversation, nextCommand) => {
    try {
      const data = await fetchSuggestedResponses(conversation, nextCommand);
      const cleanSuggestions = (data.suggestions || []).map((suggestion) => suggestion.replace(/['"]/g, ""));
      setSuggestedResponses(cleanSuggestions);
    } catch (e) {
      console.error("Error fetching suggested responses", e);
    }
  };

  const handleSuggestedResponseClick = (suggestion) => {
    setSuggestedResponses([]);
    sendMessage(suggestion);
  };

  return {
    suggestedResponses,
    updateSuggestedResponses,
    handleSuggestedResponseClick,
  };
};
