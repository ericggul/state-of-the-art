import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";

const VoiceRecorder = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const chunksRef = useRef([]);
  const silenceTimeoutRef = useRef(null);

  const SILENCE_THRESHOLD = 0.01; // Adjust this value based on your environment
  const SILENCE_DELAY = 500; // Time in ms to wait before stopping recording after silence

  useEffect(() => {
    let animationFrameId;

    const startAudioProcessing = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Set up the audio context and analyser
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        // Prepare data array for frequency data
        analyserRef.current.fftSize = 2048;
        const bufferLength = analyserRef.current.fftSize;
        dataArrayRef.current = new Uint8Array(bufferLength);

        // Set up the media recorder
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          chunksRef.current = [];
          await sendAudioToWhisper(audioBlob);
        };

        // Start voice detection
        detectVoice();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    const detectVoice = () => {
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
      let sum = 0.0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const normalized = dataArrayRef.current[i] / 128 - 1;
        sum += normalized * normalized;
      }
      const volume = Math.sqrt(sum / dataArrayRef.current.length);

      if (volume > SILENCE_THRESHOLD) {
        if (!isRecording) {
          startRecording();
        }
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
      } else if (isRecording) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            stopRecording();
          }, SILENCE_DELAY);
        }
      }

      animationFrameId = requestAnimationFrame(detectVoice);
    };

    startAudioProcessing();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToWhisper = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");

    try {
      const response = await fetch("/api/openai/whisper", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription failed");

      const { text } = await response.json();
      onTranscriptionComplete(text);
    } catch (err) {
      console.error("Error transcribing audio:", err);
    }
  };

  console.log("is Recording", isRecording);

  return <S.VoiceStatus $isRecording={isRecording}>{isRecording ? "Listening..." : "Waiting for speech..."}</S.VoiceStatus>;
};

export default VoiceRecorder;
