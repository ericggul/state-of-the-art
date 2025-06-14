import useScreenStore from "@/components/screen/store";
import { SESSION_VALIDITY_TIMEOUT } from "@/utils/constant";

export function checkSessionValidity(mobileSessionId) {
  try {
    const controllerSessionId = useScreenStore.getState().sessionId;
    const currentTime = Date.now();

    console.log(controllerSessionId, "controllerSessionId");
    console.log(mobileSessionId, "mobileSessionId");
    console.log(currentTime, "currentTime");

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

    console.log(mobileSid, "mobileSid");
    console.log(controllerSid, "controllerSid");

    if (isNaN(mobileSid) || isNaN(controllerSid)) {
      console.error("Invalid session ID format");
      return { isValid: false, error: "INVALID_FORMAT" };
    }

    // Calculate time differences
    const sidDifference = Math.abs(controllerSid - mobileSid);
    const timeSinceSession = Math.abs(currentTime - mobileSid);

    // Session is valid if either condition is met
    const isValid =
      sidDifference < SESSION_VALIDITY_TIMEOUT ||
      timeSinceSession < SESSION_VALIDITY_TIMEOUT;

    console.log(sidDifference, "sidDifference");
    console.log(timeSinceSession, "timeSinceSession");
    console.log(isValid, "isValid");

    return {
      isValid,
      difference: sidDifference,
      timeSinceSession,
      error: null,
    };
  } catch (error) {
    console.error("Session check error:", error);
    return { isValid: false, error: "CHECK_ERROR" };
  }
}
