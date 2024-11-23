import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { SCRIPT } from "./constant";

export default function Voice({ socket }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTriggerTimeRef = useRef(0);

  const INITIAL_VOLUME_THRESHOLD = 45;
  const SPEAKING_VOLUME_THRESHOLD = 25;
  const SILENCE_THRESHOLD = 600; // Wait 500ms of silence before advancing
  const lastSoundTimeRef = useRef(Date.now());
  const isSpeakingRef = useRef(false);

  const monitorSound = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkSound = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

      const now = Date.now();

      // Initial trigger or continuing speech
      if (
        (!isSpeakingRef.current && average > INITIAL_VOLUME_THRESHOLD) ||
        (isSpeakingRef.current && average > SPEAKING_VOLUME_THRESHOLD)
      ) {
        lastSoundTimeRef.current = now;
        if (!isSpeakingRef.current) {
          // Just started speaking
          isSpeakingRef.current = true;
          setDisplayText(SCRIPT[currentIndexRef.current]);
        }
      } else if (isSpeakingRef.current) {
        // Check if we've been silent long enough
        if (now - lastSoundTimeRef.current > SILENCE_THRESHOLD) {
          // Real pause detected, advance to next text
          isSpeakingRef.current = false;
          if (currentIndexRef.current < SCRIPT.length - 1) {
            currentIndexRef.current += 1;
            setCurrentIndex(currentIndexRef.current);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(checkSound);
    };

    checkSound();
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const microphone =
        audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(analyserRef.current);

      analyserRef.current.fftSize = 128;

      monitorSound();
      setIsInitialized(true);
    } catch (err) {
      console.error("Audio initialization error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    handleSocket();
  }, [displayText]);

  function handleSocket() {
    try {
      socket.current.emit("gartience-new-speech", displayText);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <S.Container>
      {!isInitialized ? (
        <S.StartButton onClick={requestMicrophoneAccess}>
          마이크 접근 허용하기
        </S.StartButton>
      ) : error ? (
        <S.ErrorMessage>{error}</S.ErrorMessage>
      ) : (
        <S.TextDisplay>{displayText.text}</S.TextDisplay>
      )}
    </S.Container>
  );
}
