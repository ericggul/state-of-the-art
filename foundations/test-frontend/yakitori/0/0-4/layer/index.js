import React, { useMemo, useState, useEffect } from "react";
import { Instances, Instance } from "@react-three/drei";
import { generateStructure } from "./structure";
import Connections from "./connections";

const X_LEN = 15;

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function SingleLayer({ yIdx, layerIdx, ...props }) {
  const localStructure = useMemo(() => generateStructure(X_LEN), [yIdx]);

  const propInterval = useMemo(() => getRandom(50, 200), []);

  const [expandedLayerIdx, setExpandedLayerIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpandedLayerIdx((i) => (i + 1) % (X_LEN * 2));
    }, propInterval);
    return () => clearInterval(interval);
  }, []);

  const [layersExpanded, setLayersExpanded] = useState(() => new Array(X_LEN).fill(0).map((_, i) => false));

  useEffect(() => {
    setLayersExpanded((prev) => prev.map((_, i) => Math.abs(i - expandedLayerIdx) < 2));
  }, [expandedLayerIdx]);

  return (
    <group {...props}>
      <Instances limit={X_LEN * X_LEN}>
        <boxGeometry args={[3, 3, 1]} />
        <meshPhysicalMaterial transmission={1} roughness={0} thickness={3} envMapIntensity={4} transparent={true} />
        {localStructure.map((structureEl, i) => (
          <Layer key={i} idx={i} {...structureEl} expanded={layersExpanded[i]} />
        ))}
      </Instances>
      <Connections layersExpanded={layersExpanded} structure={localStructure} />
    </group>
  );
}

const Layer = ({ expanded, grid, position }) => {
  return (
    <group position={position}>
      {new Array(grid.xCount).fill(0).map((_, i) => (
        <group key={i} position={[grid.xInterval * i - ((grid.xCount - 1) * grid.xInterval) / 2, 0, 0]}>
          {new Array(grid.yCount).fill(0).map((_, j) => (
            <group key={j} position={[0, grid.yInterval * j - ((grid.yCount - 1) * grid.yInterval) / 2, 0]}>
              <Instance position={[0, 0, 0]} scale={expanded ? [1, 1, 1] : [0.2, 0.2, 0.2]} color="hsl(240, 100%, 50%)" />
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};
