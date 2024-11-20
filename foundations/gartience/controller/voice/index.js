import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";

const TEST = [
  "저는 국가에서 육성한 수학 인재였습니다. 중학교 때는 영재교육원에서, 고등학교 때는 영재고에서 교육을 받았으며, 대한수학회의 국가대표 육성 겨울학교를 거쳐 서울대학교 산업공학과에 진학한 전형적인 이공계 엘리트였습니다.",
  "그러나 지금 이 자리에 서 있는 제 모습을 보며 의아해하실지도 모릅니다. 왜 전통적인 공학도로써의 길이 아닌 예술 기술 연구자로서 여러분 앞에 서게 되었는지 말입니다. 그 이유는 단순합니다. 장기적으로 AI가 주도하는 시대에서 제가 공학 분야에서 어떤 가치를 더할 수 있을지 의문이 들었고, 그 답을 예술에서 찾을 수 있다 생각했기 때문입니다.",
  "올해 노벨 화학상은 AI 연구를 기반으로 수여되었습니다. 제가 고등학교 때 밤새 고민하던 KMO의 어려운 기하 문제도 이제 AI가 더 빠르고 정확하게 해결합니다. 이처럼 이공계의 많은 분야가 점점 더 ‘알파고화’되고 있습니다. 이 변화 속에서 인간은 무엇을 할 수 있을까요? 모든 분야에서 AI가 인간을 능가하지 않을까요?",
  "저는 그렇게 생각하지 않았습니다. 인간만이 할 수 있는 무언가가 반드시 존재한다고 믿었고, 그 답을 예술에서 찾았습니다. 기계는 합리적이고 계산적입니다. 확률에 기반한 AI는 뛰어난 논리와 효율성으로 항상 최적의 결과를 도출합니다. 반면, 인간은 비합리적이고, 예측할 수 없으며, 실수투성이입니다. 때로는 감정에 휘둘려 논리를 벗어나기도 합니다.",
  "하지만 저는 바로 이러한 인간의 비완전성이야말로 우리의 가장 큰 강점이라고 깨달았습니다. 산업혁명 이후 비합리성은 오랫동안 인간의 단점으로 여겨졌습니다. 하지만 AI의 시대가 도래한 지금, 비합리성은 오히려 인간을 AI와 구분짓는 가장 고유한 특징으로 자리 잡았습니다. 이 비논리성과 비합리성, 그리고 예측 불가능성은 바로 인간 존재의 이유이며, 그것을 육성하는 것이 인류의 미래라고 믿습니다.",
  "그렇습니다. 우리 인류는 더욱 예술적이어야 합니다. 더 창의적이고, 무엇보다도 더 다양해야 합니다. 그러나 제가 목격하고 있는 동시대의 상황은 정반대입니다. 우리는 스스로를 숫자와 데이터로 환원시키며, 기계처럼 표준화되는 것을 자처하고 있습니다. 가장 단적인 예가 MBTI와 같은 심리 테스트입니다.",
  "우리는 단지 네 글자의 코드로 자신을 정의하며, 인간 고유의 복잡성과 다양성을 단순화하고 축소하려 합니다. 이런 표준화는 마치 기계가 우리를 더 쉽게 이해하고 분류할 수 있도록 돕는 과정처럼 보입니다. 하지만 그것은 결국 우리를 더 인간답지 않게 만들며, 인간성과 기계의 차이를 점점 더 모호하게 만드는 선택일 뿐입니다.",
  "저는 이러한 현실에 질문을 던지고, 인간만이 가진 고유한 가치를 탐구하기 위해 예술로 향했습니다. 예술은 단순한 창작을 넘어, 인간의 비합리적이고 예측 불가능한 본질을 기념하는 영역입니다. AI가 아무리 똑똑해도, 인간의 감정과 엉뚱함에서 비롯된 창조적 순간을 복제할 수는 없습니다. 이것이 바로 AI 시대에서도 인간이 빛날 수 있는 이유입니다.",
  "이제 우리에게 필요한 것은 더욱 예술적이고 다채로운 존재가 되는 것입니다. 비합리성과 비논리성을 우리의 강점으로 받아들이고, 기계와는 다른 방식으로 스스로를 확장해 나가야 합니다. 그것이 우리가 AI 시대에서 인간다움을 지켜낼 수 있는 유일한 길입니다.",
];

export default function Voice({ socket }) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const timeoutRef = useRef(null);
  const isActiveRef = useRef(false);
  const animationFrameRef = useRef(null);

  const VOLUME_THRESHOLD = 50;
  const PAUSE_DURATION = 1000;

  const monitorSound = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkSound = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Optimize volume calculation
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;

      if (average > VOLUME_THRESHOLD) {
        if (!isActiveRef.current) {
          isActiveRef.current = true;
        }
        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          if (isActiveRef.current) {
            if (currentIndex < TEST.length) {
              setDisplayText(TEST[currentIndex]);
              setCurrentIndex((prev) => prev + 1);
            } else {
              setDisplayText("모든 텍스트를 표시했습니다.");
            }
            isActiveRef.current = false;
          }
        }, PAUSE_DURATION);
      }

      // Schedule next check with lower frequency
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

  return (
    <S.Container>
      {!isInitialized ? (
        <S.StartButton onClick={requestMicrophoneAccess}>
          마이크 접근 허용하기
        </S.StartButton>
      ) : error ? (
        <S.ErrorMessage>{error}</S.ErrorMessage>
      ) : (
        <S.TextDisplay>{displayText}</S.TextDisplay>
      )}
    </S.Container>
  );
}
