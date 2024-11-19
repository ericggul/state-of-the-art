import { useEffect } from "react";

export function useSocketCommunication({
  activeIndex,
  models,
  socket,
  mobileId,
  isUserInteraction,
}) {
  useEffect(() => {
    if (activeIndex === null || !socket?.current || !isUserInteraction) return;

    const activeModel = models[activeIndex];
    try {
      socket.current.emit("mobile-new-architecture", {
        currentArchitectures: [activeModel],
        mobileId,
      });

      if (activeModel.explanation) {
        socket.current.emit("mobile-new-speech", {
          text: `${activeModel.name} ${activeModel.explanation}`,
          mobileId,
        });
      }
    } catch (e) {
      console.error("Socket communication error:", e);
    }
  }, [activeIndex, models, socket, mobileId, isUserInteraction]);
}
