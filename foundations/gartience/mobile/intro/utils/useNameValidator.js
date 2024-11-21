import { useCallback, useMemo } from "react";
import axios from "axios";

// Move outside hook to prevent recreation
const nameCheckerInstance = axios.create({
  baseURL: "/api/openai",
  headers: { "Content-Type": "application/json" },
});

// Updated pattern to allow more characters used in international names
const NAME_PATTERN = /^[\p{L}\p{M}\s'-]+$/u;

export function useNameValidator() {
  // Basic validation with memoized error messages
  const errorMessages = useMemo(
    () => ({
      tooShort: "Name must be at least 2 characters long",
      invalidChars:
        "Please enter a valid name without numbers or special characters",
    }),
    []
  );

  const validateUsername = useCallback(
    (value) => {
      const trimmedValue = value.trim();
      if (trimmedValue.length < 2) return errorMessages.tooShort;
      if (!NAME_PATTERN.test(trimmedValue)) return errorMessages.invalidChars;
      return "";
    },
    [errorMessages]
  );

  const verifyName = useCallback(async (name) => {
    try {
      const { data } = await nameCheckerInstance.post("/gpt-4o-namechecker", {
        text: name,
        params: { temperature: 0.4 },
      });

      return {
        isValid: data.validity,
        message: data.message,
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
