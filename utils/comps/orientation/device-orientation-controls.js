import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";

import { useThree } from "@react-three/fiber";

export default function DeviceOrientationControls() {
  const { camera } = useThree();

  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  function orientationDetector(e) {
    setOrientation({
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
    });
  }

  useEffect(() => {
    window.addEventListener("deviceorientation", orientationDetector);
    return () => {
      window.removeEventListener("deviceorientation", orientationDetector);
    };
  }, []);

  useFrame(() => {
    if (orientation) {
      const { alpha, beta, gamma } = orientation;

      console.log(alpha, beta, gamma);

      // Convert degrees to radians for Three.js
      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(-gamma);

      // camera.rotation.set(betaRad, alphaRad, gammaRad);
    }
  });

  return null;
}
