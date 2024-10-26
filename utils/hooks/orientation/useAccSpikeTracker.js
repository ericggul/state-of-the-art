import { useState, useEffect, useRef } from "react";

const THRESHOLD = 7.0;
const RESET_TIMEOUT = 100;

export default function useAccDataSpikeTracker({ accData, socket, mobileId }) {
  const [angleAvgSpike, setAngleAvgSpike] = useState(false);
  const [zSpike, setZSpike] = useState(false);
  const [angleAvgSpikeCount, setAngleAvgSpikeCount] = useState(0);
  const [zSpikeCount, setZSpikeCount] = useState(0);

  const spikeTracker = useRef({ angleAvg: "no-spike", z: "no-spike" });
  const storedSpikeVal = useRef({ angleAvg: 0, z: 0 });
  const timeoutRef = useRef(null);

  const checkForSpike = (spikeType, currentValue) => {
    if (
      spikeTracker.current[spikeType] === "no-spike" &&
      currentValue > THRESHOLD
    ) {
      spikeTracker.current[spikeType] = "spike";
      storedSpikeVal.current[spikeType] = currentValue;
      return false;
    } else if (spikeTracker.current[spikeType] === "spike") {
      if (currentValue < storedSpikeVal.current[spikeType] * 0.95) {
        spikeTracker.current[spikeType] = "no-spike";
        return true; // Spike detected
      }
      storedSpikeVal.current[spikeType] = currentValue;
    }
    return false;
  };

  const resetSpikes = () => {
    setAngleAvgSpike(false);
    setZSpike(false);
  };

  useEffect(() => {
    const absAccSum =
      Math.abs(accData.x) + Math.abs(accData.y) + Math.abs(accData.z);
    const angleAvgSpikeDetected = checkForSpike("angleAvg", absAccSum);
    const zSpikeDetected = checkForSpike("z", absAccSum);

    if (angleAvgSpikeDetected || zSpikeDetected) {
      setAngleAvgSpike(angleAvgSpikeDetected);
      setZSpike(zSpikeDetected);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(resetSpikes, RESET_TIMEOUT);
    }
  }, [accData]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (angleAvgSpike)
      setAngleAvgSpikeCount((count) => count + Math.min((count + 1) * 0.1, 1));
    if (zSpike)
      setZSpikeCount((count) => count + Math.min((count + 1) * 0.1, 1));
  }, [angleAvgSpike, zSpike]);

  // Socket emission effect
  useEffect(() => {
    if (
      (angleAvgSpikeCount > 0 || zSpikeCount > 0) &&
      socket &&
      socket.current
    ) {
      try {
        socket.current.emit("mobile-orientation-spike", {
          spikeCount: angleAvgSpikeCount + zSpikeCount,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [angleAvgSpikeCount, zSpikeCount, socket, mobileId]);

  return { angleAvgSpike, zSpike, angleAvgSpikeCount, zSpikeCount };
}
