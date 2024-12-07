import * as THREE from "three";
import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

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

  // Convert HSL to hex color
  const floorColor = new THREE.Color();
  floorColor.setHSL(debouncedHue / 360, 0.5, 0.1); // Increased lightness from 0.0 to 0.15

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.6, 0]}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <meshPhysicalMaterial
          color={floorColor}
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
