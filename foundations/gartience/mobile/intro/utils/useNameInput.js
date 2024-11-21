import { useState, useCallback, useRef } from "react";
import { useNameValidator } from "./useNameValidator";

export function useNameInput({ socket, onSuccess }) {
  const [state, setState] = useState({
    username: "",
    error: "",
    isVerifying: false,
  });

  const { validateUsername, verifyName } = useNameValidator();
  const lastEmittedName = useRef("");

  const handleSubmission = useCallback(
    async (value) => {
      const trimmedUsername = value.trim();
      const validationError = validateUsername(trimmedUsername);

      if (validationError) {
        setState((prev) => ({ ...prev, error: validationError }));
        return;
      }

      setState((prev) => ({ ...prev, isVerifying: true, error: "" }));

      try {
        const { isValid, message } = await verifyName(trimmedUsername);

        if (!isValid) {
          setState((prev) => ({
            ...prev,
            error: message || "Please enter a real name",
            isVerifying: false,
          }));
          return;
        }

        if (socket?.current) {
          socket.current.emit("mobile-new-intro", {
            type: "username_submit",
            username: trimmedUsername,
          });
        }
        onSuccess(trimmedUsername);
        setState((prev) => ({ ...prev, isVerifying: false }));
      } catch (error) {
        console.error("Name verification error:", error);
        setState((prev) => ({
          ...prev,
          error: "Unable to verify name. Please try again.",
          isVerifying: false,
        }));
      }
    },
    [socket, validateUsername, verifyName, onSuccess]
  );

  const handleUsernameChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      const basicError = validateUsername(newValue);

      setState((prev) => ({
        ...prev,
        username: newValue,
        error: basicError,
      }));

      // Prevent unnecessary socket emissions
      if (
        !basicError &&
        socket?.current &&
        newValue.trim() !== lastEmittedName.current
      ) {
        lastEmittedName.current = newValue.trim();
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
      e?.preventDefault(); // Make preventDefault optional
      if (state.isVerifying) return; // Prevent multiple submissions
      await handleSubmission(state.username);
    },
    [state.username, state.isVerifying, handleSubmission]
  );

  const handleBlur = useCallback(
    async (e) => {
      const value = e.target.value.trim();
      if (value && !state.error && !state.isVerifying) {
        await handleSubmission(value);
      }
    },
    [state.error, state.isVerifying, handleSubmission]
  );

  const handleKeyPress = useCallback(
    async (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        if (!state.error && !state.isVerifying) {
          await handleSubmission(e.target.value);
        }
      }
    },
    [state.error, state.isVerifying, handleSubmission]
  );

  return {
    username: state.username,
    error: state.error,
    isVerifying: state.isVerifying,
    handleUsernameChange,
    handleUsernameSubmit,
    handleBlur,
    handleKeyPress,
  };
}
