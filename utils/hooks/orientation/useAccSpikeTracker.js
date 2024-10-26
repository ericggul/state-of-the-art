import { useState, useEffect, useRef } from "react";

const THRESHOLD = 10; // High threshold for detecting hard shakes
const COOLDOWN_PERIOD = 5000; // 5 seconds cooldown between shakes

export default function useAccDataSpikeTracker({ accData, socket }) {
  const [spikeCount, setSpikeCount] = useState(0);
  const spikeCountRef = useRef(0);
  const lastShakeTime = useRef(0);

  useEffect(() => {
    const now = Date.now();

    // Calculate the magnitude of the acceleration vector
    const totalAcceleration = Math.sqrt(
      accData.x ** 2 + accData.y ** 2 + accData.z ** 2
    );

    // Check if we're in the cooldown period
    if (now - lastShakeTime.current < COOLDOWN_PERIOD) {
      return;
    }

    // Check if the acceleration magnitude exceeds the threshold
    if (totalAcceleration > THRESHOLD) {
      // Increment the spike count
      spikeCountRef.current += 1;

      // Update the state (this will trigger a re-render)
      setSpikeCount(spikeCountRef.current);

      lastShakeTime.current = now;

      // Emit to socket immediately
      if (socket?.current) {
        try {
          socket.current.emit("mobile-orientation-spike", {
            spikeCount: spikeCountRef.current,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [accData, socket]);

  return { spikeCount };
}
