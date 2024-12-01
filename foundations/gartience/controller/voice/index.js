import React, { Suspense, useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { SCRIPT, MODEL_CHANGE } from "./constant";
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
  const [initialThreshold, setInitialThreshold] = useState(55);

  useEffect(() => {
    try {
      console.log(currentIndex);
      if (currentIndex >= SCRIPT.length - 2) {
        if (socket.current) {
          socket.current.emit("gartience-new-chaos", { chaos: true });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [currentIndex]);

  const INITIAL_VOLUME_THRESHOLD = initialThreshold;
  const SPEAKING_VOLUME_THRESHOLD = 25;
  const SILENCE_THRESHOLD = 600; // Wait 500ms of silence before advancing
  const lastSoundTimeRef = useRef(Date.now());
  const isSpeakingRef = useRef(false);

  const streamRef = useRef(null);
  const microphoneRef = useRef(null);

  const monitorSound = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkSound = () => {
      if (!analyserRef.current) return;

      try {
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
      } catch (error) {
        console.error("Sound monitoring error:", error);
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    checkSound();
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const microphone =
        audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current = microphone;
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
        [MODEL_CHANGE]: "Boltzmann Machine",
        [MODEL_CHANGE + 1]: "Variational Autoencoder (VAE)",
        [MODEL_CHANGE + 2]: "AlexNet",
        [MODEL_CHANGE + 3]: "SimCLR",
        [MODEL_CHANGE + 4]: "Multi-Layer Perceptron (MLP)",
        [MODEL_CHANGE + 5]: "Generative Adversarial Networks (GANs)",
        [MODEL_CHANGE + 6]: "RNN (Recurrent Neural Network)",
        [MODEL_CHANGE + 7]: "Stable Diffusion",
        [MODEL_CHANGE + 8]: "ALBERT",
        [MODEL_CHANGE + 9]: "Show and Tell",
        [MODEL_CHANGE + 10]: "Basic Autoencoder",
        [MODEL_CHANGE + 11]: "Perceptron",
        [MODEL_CHANGE + 12]: "DCGAN",
        [MODEL_CHANGE + 13]: "DDPM",
        [MODEL_CHANGE + 14]: "PPO",
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

    if (displayText.paragraph >= 4) {
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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
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
          min="45"
          max="70"
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
          <Suspense fallback={null}>
            <S.TextDisplay>
              Current:{" "}
              {displayText && displayText.text
                ? displayText.text.slice(0, 80)
                : ""}
            </S.TextDisplay>
            <S.NextTextDisplay>
              Next:{" "}
              {nextText && nextText.text ? nextText.text.slice(0, 70) : ""}
            </S.NextTextDisplay>
          </Suspense>

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
