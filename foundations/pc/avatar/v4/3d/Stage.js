import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";
import { useRef } from "react";

const DEFAULT_FLOOR = {
  floorColor: "#303030",
  floorMetalness: 0.9,
  floorRoughness: 0.9,
  floorOpacity: 1,
  floorReflectivity: 0.5,
  floorClearcoat: 0.1,
};

const DEFAULT_PLATFORM = {
  platformColor: "#1a1a1a",
  platformMetalness: 0.5,
  platformRoughness: 0.5,
};

export function Stage({ controls = {} }) {
  const { floor = DEFAULT_FLOOR, platform = DEFAULT_PLATFORM } = controls;
  const currentArchitectures = useScreenStore(
    (state) => state.currentArchitectures
  );
  const targetHue = currentArchitectures?.[0]?.hue ?? 230;
  const debouncedHue = useDebounce(targetHue, 100);

  // Create refs for current hue and material
  const currentHueRef = useRef(debouncedHue);
  const materialRef = useRef();

  // Smooth interpolation in animation frame
  useFrame(() => {
    if (!materialRef.current) return;

    // Smoothly interpolate current hue towards target hue
    currentHueRef.current += (debouncedHue - currentHueRef.current) * 0.05;

    // Update material color
    const color = new THREE.Color();
    color.setHSL(currentHueRef.current / 360, 0.5, 0.1);
    materialRef.current.color = color;
  });

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.6, 0]}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <meshPhysicalMaterial
          ref={materialRef}
          metalness={floor.floorMetalness}
          roughness={floor.floorRoughness}
          opacity={floor.floorOpacity}
          transparent
          reflectivity={floor.floorReflectivity}
          clearcoat={floor.floorClearcoat}
        />
      </mesh>
    </>
  );
}
