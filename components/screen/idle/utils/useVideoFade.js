import { useState, useEffect } from "react";

const FADE_DURATION = 3;

export const useVideoFade = (videoRef) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= FADE_DURATION) {
        setIsVisible(false);
      } else if (timeLeft > FADE_DURATION) {
        setIsVisible(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [videoRef]);

  return isVisible;
};
