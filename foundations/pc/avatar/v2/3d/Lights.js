import * as THREE from "three";
import { useMemo } from "react";

export function Lights({ controls }) {
  console.log("Lights controls:", controls);

  if (!controls) {
    console.warn("No light controls provided");
    return null;
  }

  const {
    ambientIntensity = 0.3,
    spotLight1 = {},
    spotLight2 = {},
    frontLight = {},
  } = controls;

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      {spotLight1 && (
        <spotLight
          position={[-4, 6, -4]}
          angle={spotLight1.angle1 || 0.5}
          penumbra={spotLight1.penumbra1 || 0.5}
          intensity={spotLight1.intensity1 || 0.8}
          color={spotLight1.color1 || "#4facfe"}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[512, 512]}
        />
      )}
      {spotLight2 && (
        <spotLight
          position={[4, 6, -4]}
          angle={spotLight2.angle2 || 0.5}
          penumbra={spotLight2.penumbra2 || 0.5}
          intensity={spotLight2.intensity2 || 0.8}
          color={spotLight2.color2 || "#00f2fe"}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[512, 512]}
        />
      )}
      {frontLight && (
        <spotLight
          position={[0, 3, 4]}
          angle={frontLight.angleFront || 0.6}
          penumbra={frontLight.penumbraFront || 0.5}
          intensity={frontLight.intensityFront || 0.6}
          color={frontLight.colorFront || "#ffffff"}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[512, 512]}
        />
      )}
    </>
  );
}
