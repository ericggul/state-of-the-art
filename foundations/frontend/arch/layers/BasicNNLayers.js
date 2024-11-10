import React, { useMemo, useState, useEffect, memo } from "react";
import { useSpring, animated } from "@react-spring/three";
import Connections from "../connections/Connections";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";

// Optimized structure generation with memoized configs
const generateStructure = (modelStructure, model) => {
  const layerConfig = LAYER_CONFIGS[model];
  const gridConfig = GRID_CONFIGS[model] || {};
  const halfLength = (modelStructure.length - 1) / 2;

  return modelStructure.map((layer, i) => ({
    ...layer,
    position: [0, 0, layerConfig.layerHeight * (i - halfLength)],
    node: { size: [4, 4, 0.3] },
    unexpandedNode: { size: [8, 8, 0.3] },
    grid: {
      xCount: layer.neurons,
      yCount: layer.neurons,
      xInterval: gridConfig[layer.type]?.xInterval || 5,
      yInterval: gridConfig[layer.type]?.yInterval || 5,
    },
  }));
};

// Memoized grid component for better performance
const GridNodes = memo(({ grid, nodeSize, nodeMaterialProps }) => (
  <>
    {new Array(grid.xCount).fill(0).map((_, i) => (
      <group
        key={`x-${i}`}
        position={[grid.xInterval * (i - (grid.xCount - 1) / 2), 0, 0]}
      >
        {new Array(grid.yCount).fill(0).map((_, j) => (
          <mesh
            key={`y-${j}`}
            position={[0, grid.yInterval * (j - (grid.yCount - 1) / 2), 0]}
          >
            <boxGeometry args={nodeSize} />
            <meshStandardMaterial {...nodeMaterialProps} />
          </mesh>
        ))}
      </group>
    ))}
  </>
));

GridNodes.displayName = "GridNodes";

// Optimized SingleLayer component
const SingleLayer = memo(
  ({ position, grid, node, unexpandedNode, type, expanded, style }) => {
    const springConfig = {
      mass: 1,
      tension: 170,
      friction: 26,
      clamp: false,
    };

    const { scale } = useSpring({
      scale: expanded ? 1 : 0,
      config: springConfig,
    });

    const nodeMaterialProps = useMemo(
      () => ({
        ...style.material,
        color: style.colors[type] || style.colors.inner,
      }),
      [style, type]
    );

    if (!grid) return null;

    return (
      <group position={position}>
        <animated.group scale={scale}>
          <GridNodes
            grid={grid}
            nodeSize={node.size}
            nodeMaterialProps={nodeMaterialProps}
          />
        </animated.group>
        <animated.group scale={scale.to((v) => 1 - v)}>
          <mesh>
            <boxGeometry args={unexpandedNode.size} />
            <meshStandardMaterial {...nodeMaterialProps} />
          </mesh>
        </animated.group>
      </group>
    );
  }
);

SingleLayer.displayName = "SingleLayer";

// Main component with optimized state management
const BasicNNLayers = memo(({ structure, style, model }) => {
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
    }, 500);
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
});

BasicNNLayers.displayName = "BasicNNLayers";
export default BasicNNLayers;
