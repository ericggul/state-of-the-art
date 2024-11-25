import { useState, useEffect } from "react";

const FADE_DURATION = 3;

export const useVideoFade = (videoRef) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      if (!isInitialLoad) return;
      // Keep the original setTimeout for reliable initial fade
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsInitialLoad(false);
      }, 100);
      return () => clearTimeout(timer);
    };

    const handleTimeUpdate = () => {
      if (isInitialLoad) return;
      const timeLeft = video.duration - video.currentTime;
      setIsVisible(timeLeft > FADE_DURATION);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Call handleLoadedData if video is already loaded
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef, isInitialLoad]);

  return isVisible;
};
