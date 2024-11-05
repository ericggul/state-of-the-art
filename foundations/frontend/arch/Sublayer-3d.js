import React, { useMemo } from "react";
import { Text, Text3D, Center } from "@react-three/drei";
import InstancedNodes from "./InstancedNodes";
import { GRID_CONFIGS } from "../arch-models";
import useScreenStore from "@/components/screen/store";
import { MeshStandardMaterial } from "three";

export const INTERLAYER_MARGIN_X = 1.6;
export const INTERLAYER_MARGIN_Y = 3.0;

const DEFAULT_GRID = {
  xCount: 3,
  yCount: 3,
  xInterval: 10,
  yInterval: 10,
};

// Shared material for all text instances
const textMaterial = new MeshStandardMaterial({
  color: "white",
  metalness: 1,
  roughness: 0.2,
});

const Sublayer = React.memo(
  ({
    position,
    sublayer,
    rotation,
    style,
    model,
    useGivenInterval = false,
  }) => {
    const { isProjector } = useScreenStore();

    const size = sublayer.dimensions || [20, 8, 8];
    let gridConfig = GRID_CONFIGS[model] || {};

    const grid = gridConfig[sublayer.type] || DEFAULT_GRID;

    // Memoize text configuration with balanced optimization
    const textConfig = useMemo(
      () => ({
        baseSize: size[0] + size[1] + size[2],
        titleSize: (size[0] + size[1] + size[2]) * 0.02,
        subtitleSize: (size[0] + size[1] + size[2]) * 0.015,
        commonProps: {
          font: "/fonts/Roboto.json",
          height: 0.4,
          bevelEnabled: true,
          bevelSize: 0.02,
          bevelThickness: 0.02,
          bevelSegments: 1,
          curveSegments: 3,
          material: textMaterial,
        },
      }),
      [size]
    );

    // Memoize Text3D components
    const Text3DComponents = useMemo(() => {
      if (isProjector) return null;

      return (
        <group position={[0, size[1] * 0.6, 0]}>
          <Center>
            <Text3D
              {...textConfig.commonProps}
              position={[0, 0, 0]}
              rotation={[Math.PI / 2, Math.PI, Math.PI]}
              size={textConfig.titleSize}
            >
              {sublayer.name}
            </Text3D>
          </Center>
        </group>
      );
    }, [isProjector, sublayer.name, sublayer.type, size, textConfig]);

    return (
      <group position={position}>
        <InstancedNodes
          xCount={grid.xCount}
          yCount={grid.yCount}
          xInterval={
            useGivenInterval
              ? grid.xInterval
              : (size[0] / grid.xCount) * INTERLAYER_MARGIN_X
          }
          yInterval={
            useGivenInterval
              ? grid.yInterval
              : (size[1] / grid.yCount) * INTERLAYER_MARGIN_Y
          }
          nodeSize={[size[0] / grid.xCount, size[1] / grid.yCount, size[2]]}
          style={style}
          color={style.colors.inner}
          rotation={[Math.PI / 2, 0, 0]}
          sublayer={sublayer}
        />

        {Text3DComponents}
      </group>
    );
  }
);

Sublayer.displayName = "Sublayer";

export default Sublayer;
