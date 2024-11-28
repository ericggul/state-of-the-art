import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { SCRIPT } from "./constant";
import { getFlatModels } from "../components/ArchitectureSelector";

export default function Voice({ socket, setState, onModelSelect }) {
  const [displayText, setDisplayText] = useState("");
  const [nextText, setNextText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTriggerTimeRef = useRef(0);
  const [initialThreshold, setInitialThreshold] = useState(45);

  const INITIAL_VOLUME_THRESHOLD = initialThreshold;
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

      if (
        (!isSpeakingRef.current && average > INITIAL_VOLUME_THRESHOLD) ||
        (isSpeakingRef.current && average > SPEAKING_VOLUME_THRESHOLD)
      ) {
        lastSoundTimeRef.current = now;
        if (!isSpeakingRef.current) {
          isSpeakingRef.current = true;
          setDisplayText(SCRIPT[currentIndexRef.current]);
          if (currentIndexRef.current + 1 < SCRIPT.length) {
            setNextText(SCRIPT[currentIndexRef.current + 1]);
          } else {
            setNextText({ text: "End of script reached" });
          }
        }
      } else if (isSpeakingRef.current) {
        if (now - lastSoundTimeRef.current > SILENCE_THRESHOLD) {
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

    // Auto-select architecture based on voice progress
    if (displayText) {
      const modelMap = {
        25: "Boltzmann Machine", // 볼츠만 머신
        26: "Variational Autoencoder (VAE)", // VAE
        27: "AlexNet", // 알렉스넷
        28: "SimCLR", // 트랜스포머
        29: "Hopfield Network", // 홉필드 네트워크
        30: "Multi-Layer Perceptron (MLP)",
        31: "Generative Adversarial Networks (GANs)",
        32: "RNN (Recurrent Neural Network)",
        33: "Stable Diffusion",
        34: "ALBERT",
        35: "Show and Tell",
        37: "Basic Autoencoder",
        39: "DCGAN",
        40: "DDPM",
        41: "PPO",
      };

      if (modelMap[displayText.idx]) {
        // Find the corresponding model from getFlatModels
        const models = getFlatModels();
        const targetModel = models.find(
          (model) => model.name === modelMap[displayText.idx]
        );

        if (targetModel) {
          onModelSelect(targetModel); // This will update both local state and emit socket
        }
      }
    }

    if (displayText.paragraph >= 4 && displayText.idx >= 19) {
      setState(1);
    }
    if (displayText.paragraph >= 9) {
      setState(2);
    }
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

  const handleNext = () => {
    if (currentIndexRef.current < SCRIPT.length - 1) {
      currentIndexRef.current += 1;
      setCurrentIndex(currentIndexRef.current);
      setDisplayText(SCRIPT[currentIndexRef.current]);
      if (currentIndexRef.current + 1 < SCRIPT.length) {
        setNextText(SCRIPT[currentIndexRef.current + 1]);
      } else {
        setNextText({ text: "End of script reached" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1;
      setCurrentIndex(currentIndexRef.current);
      setDisplayText(SCRIPT[currentIndexRef.current]);
      if (currentIndexRef.current + 1 < SCRIPT.length) {
        setNextText(SCRIPT[currentIndexRef.current + 1]);
      } else {
        setNextText({ text: "End of script reached" });
      }
    }
  };

  return (
    <S.Container>
      <S.ThresholdContainer>
        <S.ThresholdLabel>
          Voice Sensitivity: {initialThreshold}
        </S.ThresholdLabel>
        <S.ThresholdSlider
          type="range"
          min="35"
          max="65"
          value={initialThreshold}
          onChange={(e) => setInitialThreshold(Number(e.target.value))}
        />
      </S.ThresholdContainer>

      {!isInitialized ? (
        <S.StartButton onClick={requestMicrophoneAccess}>
          마이크 접근 허용하기
        </S.StartButton>
      ) : error ? (
        <S.ErrorMessage>{error}</S.ErrorMessage>
      ) : (
        <>
          <S.TextDisplay>Current: {displayText.text}</S.TextDisplay>
          <S.NextTextDisplay>Next: {nextText.text}</S.NextTextDisplay>
          <S.Navigation>
            <S.NavButton onClick={handlePrevious}>-</S.NavButton>
            <S.ScriptPosition>
              {currentIndexRef.current + 1}/{SCRIPT.length}
            </S.ScriptPosition>
            <S.NavButton onClick={handleNext}>+</S.NavButton>
          </S.Navigation>
        </>
      )}
    </S.Container>
  );
}
