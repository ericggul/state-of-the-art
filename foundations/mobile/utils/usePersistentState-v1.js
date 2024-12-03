import { useState, useEffect } from "react";

export function usePersistentState() {
  const [state, setState] = useState({
    username: "",
    isAccelerometerActive: undefined,
    isLoading: true,
  });

  // Load state on mount
  useEffect(() => {
    async function loadState() {
      try {
        const response = await fetch("/api/user-state");
        const data = await response.json();

        if (data) {
          setState({
            username: data.username,
            isAccelerometerActive: data.isAccelerometerActive,
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error loading state:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }

    loadState();
  }, []);

  // Save state when it changes
  const updateState = async (newState) => {
    try {
      await fetch("/api/user-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newState),
      });

      setState({
        ...newState,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error saving state:", error);
    }
  };

  return [state, updateState];
}
