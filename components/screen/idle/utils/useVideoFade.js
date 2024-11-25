import { useState, useEffect } from "react";

const FADE_DURATION = 3;

export const useVideoFade = (videoRef) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      if (isInitialLoad) {
        setTimeout(() => {
          setIsVisible(true);
          setIsInitialLoad(false);
        }, 100);
      }
    };

    const handleTimeUpdate = () => {
      if (isInitialLoad) return;

      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= FADE_DURATION) {
        setIsVisible(false);
      } else if (timeLeft > FADE_DURATION) {
        setIsVisible(true);
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef, isInitialLoad]);

  return isVisible;
};
