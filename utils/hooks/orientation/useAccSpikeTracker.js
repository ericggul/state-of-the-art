import { useState, useEffect, useRef } from "react";

const THRESHOLD = 8; // 스파이크 감지를 위한 임계값 증가
const COOLDOWN_PERIOD = 500; // 연속 스파이크 방지를 위한 쿨다운 시간 감소 (밀리초)
const WINDOW_SIZE = 5; // 이동 평균을 위한 윈도우 크기

export default function useAccSpikeTracker({ accData, socket }) {
  const [spikeCount, setSpikeCount] = useState(0);
  const spikeCountRef = useRef(0);
  const lastShakeTime = useRef(0);
  const accelerationWindow = useRef([]);

  useEffect(() => {
    const now = Date.now();

    // 가속도 벡터의 크기 계산
    const totalAcceleration = Math.sqrt(
      accData.x ** 2 + accData.y ** 2 + accData.z ** 2
    );

    // 이동 평균 윈도우 업데이트
    accelerationWindow.current.push(totalAcceleration);
    if (accelerationWindow.current.length > WINDOW_SIZE) {
      accelerationWindow.current.shift();
    }

    // 이동 평균 계산
    const avgAcceleration =
      accelerationWindow.current.reduce((a, b) => a + b, 0) /
      accelerationWindow.current.length;

    // 쿨다운 기간 체크
    if (now - lastShakeTime.current < COOLDOWN_PERIOD) {
      return;
    }

    // 현재 가속도가 평균보다 현저히 높은지 확인
    if (totalAcceleration > avgAcceleration + THRESHOLD) {
      spikeCountRef.current += 1;
      setSpikeCount(spikeCountRef.current);
      lastShakeTime.current = now;

      // 소켓으로 즉시 전송
      if (socket?.current) {
        try {
          socket.current.emit("mobile-orientation-spike", {
            spikeCount: spikeCountRef.current,
            acceleration: totalAcceleration,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [accData, socket]);

  return { spikeCount };
}
