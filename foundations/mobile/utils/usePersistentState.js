import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function usePersistentState() {
  const [state, setState] = useState({
    username: "",
    isAccelerometerActive: undefined,
    isLoading: true,
    mobileId: "",
  });

  // Load state on mount
  useEffect(() => {
    async function loadState() {
      try {
        const response = await fetch("/api/user-state");
        const data = await response.json();

        // Handle mobileId
        const existingMobileId =
          data?.mobileId || localStorage.getItem("mobileId");
        const finalMobileId = existingMobileId || (true ? uuidv4() : "dummy");

        if (!existingMobileId) {
          localStorage.setItem("mobileId", finalMobileId);
        }

        // Set complete state including persisted data
        setState((prev) => ({
          ...prev,
          ...(data || {}), // Spread all existing cookie data
          mobileId: finalMobileId, // Ensure mobileId is set
          isLoading: false,
        }));
      } catch (error) {
        console.error("Error loading state:", error);
        const fallbackMobileId =
          localStorage.getItem("mobileId") || (true ? uuidv4() : "dummy");

        localStorage.setItem("mobileId", fallbackMobileId);
        setState((prev) => ({
          ...prev,
          mobileId: fallbackMobileId,
          isLoading: false,
        }));
      }
    }

    loadState();
  }, []);

  const updateState = async (newState) => {
    try {
      const updatedState = {
        ...newState,
        mobileId: state.mobileId,
      };

      await fetch("/api/user-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedState),
      });

      setState(updatedState);
    } catch (error) {
      console.error("Error saving state:", error);
    }
  };

  return [state, updateState];
}
