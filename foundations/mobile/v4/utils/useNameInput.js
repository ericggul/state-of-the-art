import { useState, useCallback } from "react";
import { useNameValidator } from "./useNameValidator";

export function useNameInput({ socket, onSuccess }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { validateUsername, verifyName } = useNameValidator();

  const handleUsernameChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setUsername(newValue);

      // Basic validation first
      const basicError = validateUsername(newValue);
      setError(basicError);

      // Emit update only if basic validation passes
      if (!basicError && socket?.current) {
        socket.current.emit("mobile-new-intro", {
          type: "username_update",
          username: newValue.trim(),
        });
      }
    },
    [validateUsername, socket]
  );

  const handleUsernameSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmedUsername = username.trim();
      const validationError = validateUsername(trimmedUsername);

      if (validationError) {
        setError(validationError);
        return;
      }

      setIsVerifying(true);
      setError("");

      try {
        const { isValid, message } = await verifyName(trimmedUsername);

        if (!isValid) {
          setError(message || "Please enter a real name");
          return;
        }

        if (socket?.current) {
          socket.current.emit("mobile-new-intro", {
            type: "username_submit",
            username: trimmedUsername,
          });
        }
        onSuccess(trimmedUsername);
      } catch (error) {
        console.error("Name verification error:", error);
        setError("Unable to verify name. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    [username, socket, validateUsername, verifyName, onSuccess]
  );

  return {
    username,
    error,
    isVerifying,
    handleUsernameChange,
    handleUsernameSubmit,
  };
}
