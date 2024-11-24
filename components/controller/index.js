"use client";

import useSocketController from "@/utils/socket/useSocketController";
import useControllerStore from "./store";

export default function Controller() {
  const {
    activeMobileId,
    isMobileVisible,
    currentArchitecture,
    handleNewMobileInit,
    handleNewMobileVisibility,
    handleNewMobileArchitecture,
  } = useControllerStore();

  // Just set up the socket listeners
  useSocketController({
    handleNewMobileInit,
    handleNewMobileVisibility,
    handleNewMobileArchitecture,
  });

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Controller Status</h2>
        <p>Mobile ID: {activeMobileId || "No mobile connected"}</p>
        <p>Mobile Status: {isMobileVisible ? "Active" : "Inactive"}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold">Current Architecture</h2>
        <p>{currentArchitecture?.name || "None selected"}</p>
      </div>
    </div>
  );
}
