import { useCallback } from "react";
import axios from "axios";

export function useNameValidator() {
  // Basic validation
  const validateUsername = useCallback((value) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
      return "Please use only English letters";
    }

    return "";
  }, []);

  // GPT validation
  const verifyName = useCallback(async (name) => {
    try {
      const response = await axios.post("/api/openai/gpt-4o-namechecker", {
        text: name,
        params: {
          temperature: 0.1,
        },
      });

      return {
        isValid: response.data.validity,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Name verification error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }, []);

  return {
    validateUsername,
    verifyName,
  };
}
