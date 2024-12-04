import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { IS_DEPLOYMENT } from "@/utils/constant";

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
        const existingMobileId =
          data?.mobileId || localStorage.getItem("mobileId");

        if (existingMobileId) {
          setState((prev) => ({
            ...prev,
            mobileId: existingMobileId,
            isLoading: false,
          }));
        } else {
          const newMobileId = true ? uuidv4() : "dummy";
          localStorage.setItem("mobileId", newMobileId);
          setState((prev) => ({
            ...prev,
            mobileId: newMobileId,
            isLoading: false,
          }));
        }
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

  // Save state when it changes, but never modify mobileId
  const updateState = async (newState) => {
    try {
      const updatedState = {
        ...newState,
        mobileId: state.mobileId, // Always keep existing mobileId
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
