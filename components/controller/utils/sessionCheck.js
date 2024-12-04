import useScreenStore from "@/components/screen/store";
import { SESSION_VALIDITY_TIMEOUT } from "@/utils/constant";

export function checkSessionValidity(mobileSessionId) {
  try {
    const controllerSessionId = useScreenStore.getState().sessionId;

    console.log(controllerSessionId, "controllerSessionId");
    console.log(mobileSessionId, "mobileSessionId");

    // Check if sessionIds exist
    if (
      typeof mobileSessionId === "undefined" ||
      typeof controllerSessionId === "undefined"
    ) {
      console.error("Missing session IDs");
      return { isValid: false, error: "MISSING_IDS" };
    }

    // Convert to numbers and validate
    const mobileSid = Number(mobileSessionId);
    const controllerSid = Number(controllerSessionId);

    if (isNaN(mobileSid) || isNaN(controllerSid)) {
      console.error("Invalid session ID format");
      return { isValid: false, error: "INVALID_FORMAT" };
    }

    // Calculate time difference
    const difference = Math.abs(controllerSid - mobileSid);
    const isValid = difference < SESSION_VALIDITY_TIMEOUT;

    return {
      isValid,
      difference,
      error: null,
    };
  } catch (error) {
    console.error("Session check error:", error);
    return { isValid: false, error: "CHECK_ERROR" };
  }
}
