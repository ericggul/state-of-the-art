export const LAYER_NUMBER = 5;
export const TRAINING_INTERVAL = 200;

export default function handlePropagation({ timeoutRefs, data, socket }) {
  // PROPAGATION
  for (let i = 0; i < LAYER_NUMBER; i++) {
    const timeout = setTimeout(() => {
      if (socket && socket.current) {
        socket.current.emit("conductor-propagation", {
          layerIdx: i,
          type: "propagation",
          mobileId: data.mobileId,
          propagationId: data.propagationId,
          text: data.text,
        });
      }
    }, i * TRAINING_INTERVAL);

    timeoutRefs.current.push(timeout);
  }

  // BACK PROPAGATION
  for (let i = 0; i < LAYER_NUMBER; i++) {
    const timeout = setTimeout(() => {
      if (socket && socket.current) {
        socket.current.emit("conductor-propagation", {
          layerIdx: LAYER_NUMBER - 1 - i,
          type: "back-propagation",
          mobileId: data.mobileId,
          propagationId: data.propagationId,
          text: data.text,
        });
      }
    }, (i + LAYER_NUMBER) * TRAINING_INTERVAL);

    timeoutRefs.current.push(timeout);
  }
}
