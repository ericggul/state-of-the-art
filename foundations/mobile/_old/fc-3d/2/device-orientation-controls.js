import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";

import useSocket from "@/utils/socket/orientation/useSocketMobile";

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default function DeviceOrientationControls({ mobileId }) {
  const socket = useSocket({ mobileId });

  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const initialLengthRef = useRef(null);

  const orientationDetector = (e) => {
    const newOrientation = {
      alpha: e.alpha || 0,
      beta: e.beta || 0,
      gamma: e.gamma || 0,
    };
    setOrientation(newOrientation);

    if (socket && socket.current) {
      socket.current.emit("mobile-orientation-changed", {
        mobileId,
        orientation: newOrientation,
      });
    }
  };

  const throttledOrientationDetector = throttle(orientationDetector, 100);

  useEffect(() => {
    window.addEventListener("deviceorientation", throttledOrientationDetector);
    return () => {
      window.removeEventListener("deviceorientation", throttledOrientationDetector);
    };
  }, [throttledOrientationDetector]);

  useFrame((state) => {
    const { alpha, beta, gamma } = orientation;

    // Convert degrees to radians for Three.js
    const alphaRad = THREE.MathUtils.degToRad(-alpha);
    const betaRad = THREE.MathUtils.degToRad(-beta);
    const gammaRad = THREE.MathUtils.degToRad(-gamma);

    eulerRef.current.set(betaRad, alphaRad, gammaRad, "YXZ");
    quaternionRef.current.setFromEuler(eulerRef.current);

    // Store the initial length on the first frame
    if (initialLengthRef.current === null) {
      initialLengthRef.current = state.camera.position.length();
    }
    const length = initialLengthRef.current;

    targetPositionRef.current.set(0, 0, length).applyQuaternion(quaternionRef.current);

    state.camera.position.lerp(targetPositionRef.current, 0.12);
    state.camera.lookAt(0, 0, 0); // Ensure camera is always looking at the origin
  });

  return null;
}
