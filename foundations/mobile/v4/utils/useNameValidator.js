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
      // Create a promise that rejects after 2 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), 2000);
      });

      // Race between the API call and the timeout
      const { data } = await Promise.race([
        nameCheckerInstance.post("/gpt-4o-namechecker", {
          text: name,
          params: { temperature: 0.4 },
        }),
        timeoutPromise,
      ]);

      return {
        isValid: data.validity,
        message: data.message,
      };
    } catch (error) {
      console.log("Name auto-validated due to:", error.message || "API error");

      // Auto-validate on timeout or any other error
      return {
        isValid: true,
        message: "Name validated",
      };
    }
  }, []);

  return {
    validateUsername,
    verifyName,
  };
}
