import React, { useMemo, useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import Connections from "../Connections";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../models";

// Function to generate the structure
function generateStructure(modelStructure, model) {
  const layerConfig = LAYER_CONFIGS[model];
  const gridConfig = GRID_CONFIGS[model] || {};

  return modelStructure.map((layer, i) => ({
    ...layer,
    position: [
      0,
      0,
      layerConfig.layerHeight * (i - (modelStructure.length - 1) / 2),
    ],
    node: {
      size: [4, 4, 0.3],
    },
    unexpandedNode: {
      size: [8, 8, 0.3],
    },
    grid: {
      xCount: layer.neurons,
      yCount: layer.neurons,
      xInterval: gridConfig[layer.type]?.xInterval || 5,
      yInterval: gridConfig[layer.type]?.yInterval || 5,
    },
  }));
}

export default function BasicNNLayers({ structure, style, model }) {
  const localStructure = useMemo(
    () => generateStructure(structure, model),
    [structure, model]
  );

  const [expandedLayerIdx, setExpandedLayerIdx] = useState(0);
  const [layersExpanded, setLayersExpanded] = useState(() =>
    new Array(structure.length).fill(false)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setExpandedLayerIdx((i) => (i + 1) % structure.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [structure.length]);

  useEffect(() => {
    setLayersExpanded((prev) =>
      prev.map((_, i) => Math.abs(i - expandedLayerIdx) < 2)
    );
  }, [expandedLayerIdx]);

  return (
    <group>
      {localStructure.map((structureEl, i) => (
        <SingleLayer
          key={i}
          {...structureEl}
          expanded={layersExpanded[i]}
          style={style}
        />
      ))}
      <Connections
        layersExpanded={layersExpanded}
        structure={localStructure}
        style={style}
      />
    </group>
  );
}

// Define the SingleLayer component directly in this file
const SingleLayer = (props) => {
  const { expanded, style } = props;

  const [smoothedExpanded, api] = useSpring(() => ({
    smoothedExpanded: 0,
    config: { mass: 1, tension: 120, friction: 13 },
  }));

  useEffect(() => {
    api.start({ smoothedExpanded: expanded ? 1 : 0 });
  }, [expanded, api]);

  const nodeMaterialProps = {
    ...style.material,
    color: style.colors[props.type] || style.colors.inner,
  };

  return (
    <group position={props.position}>
      {props.grid && (
        <>
          <animated.group scale={smoothedExpanded.smoothedExpanded}>
            {new Array(props.grid.xCount).fill(0).map((_, i) => (
              <group
                key={`x-${i}`}
                position={[
                  props.grid.xInterval * (i - (props.grid.xCount - 1) / 2),
                  0,
                  0,
                ]}
              >
                {new Array(props.grid.yCount).fill(0).map((_, j) => (
                  <mesh
                    key={`y-${j}`}
                    position={[
                      0,
                      props.grid.yInterval * (j - (props.grid.yCount - 1) / 2),
                      0,
                    ]}
                  >
                    <boxGeometry args={props.node.size} />
                    <meshStandardMaterial {...nodeMaterialProps} />
                  </mesh>
                ))}
              </group>
            ))}
          </animated.group>

          <animated.group
            scale={smoothedExpanded.smoothedExpanded.to((v) => 1 - v)}
          >
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={props.unexpandedNode.size} />
              <meshStandardMaterial {...nodeMaterialProps} />
            </mesh>
          </animated.group>
        </>
      )}
    </group>
  );
};
