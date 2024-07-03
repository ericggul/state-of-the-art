const LAYER_NUMBER = 5;
const TRAINING_INTERVAL = 100;

import { useState, useEffect, useRef } from "react";

export default function useTraining({ training }) {
  const [layersTraining, setLayersTraining] = useState(new Array(LAYER_NUMBER).fill("idle"));

  const timeoutRefs = useRef([]);

  useEffect(() => {
    if (training) {
      handleNewTraining();
    }
  }, [training]);

  function handleNewTraining() {
    // PROPAGATION
    for (let i = 0; i < LAYER_NUMBER; i++) {
      const timeout = setTimeout(() => {
        setLayersTraining((l) => {
          const newLayers = [...l];
          newLayers[i] = "propagation";
          return newLayers;
        });
      }, i * TRAINING_INTERVAL);

      timeoutRefs.current.push(timeout);
    }

    // BACK PROPAGATION
    for (let i = 0; i < LAYER_NUMBER; i++) {
      const timeout = setTimeout(() => {
        setLayersTraining((l) => {
          const newLayers = [...l];
          newLayers[LAYER_NUMBER - 1 - i] = "back-propagation";
          return newLayers;
        });
      }, (i + LAYER_NUMBER) * TRAINING_INTERVAL);

      timeoutRefs.current.push(timeout);
    }
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  return layersTraining;
}
