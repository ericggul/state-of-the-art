import React, { useState, useEffect, useMemo } from "react";
import { useSpring, animated } from "@react-spring/three";
import Node from "../Node";
import InstancedNodes from "../InstancedNodes";
import { LAYER_CONFIGS, GRID_CONFIGS } from "../../arch-models";
import useScreenStore from "@/components/screen/store";

const clampHSL = (h, s, l) => {
  // Hue is circular (0-360)
  h = ((h % 360) + 360) % 360;
  // Saturation and lightness are percentages (0-100)
  s = Math.max(0, Math.min(100, s));
  // Prevent white-out by keeping lightness in a reasonable range
  l = Math.max(20, Math.min(80, l));
  return [h, s, l];
};

const getLayerColor = (baseColor, layerIndex, layerType) => {
  if (!baseColor.startsWith("hsl")) {
    return baseColor; // Return original if not HSL
  }

  try {
    const [hue, saturation, lightness] = baseColor.match(/\d+/g).map(Number);

    // Calculate modifications based on layer type and index
    let h, s, l;

    switch (layerType) {
      case "conv":
        [h, s, l] = clampHSL(
          hue + ((layerIndex * 15) % 40), // Smaller hue changes
          saturation + 5,
          lightness + (layerIndex % 2) * 10 // Alternate lightness
        );
        break;
      case "pool":
        [h, s, l] = clampHSL(hue - 10, saturation - 10, lightness + 15);
        break;
      case "fc":
        [h, s, l] = clampHSL(hue + 20, saturation + 10, lightness - 10);
        break;
      default:
        [h, s, l] = clampHSL(hue, saturation, lightness);
    }

    // Fallback color if HSL parsing fails
    return `hsl(${h}, ${s}%, ${l}%)`;
  } catch (err) {
    console.warn("Color parsing error:", err);
    return style?.colors?.inner || "#666666"; // Fallback color
  }
};

const CNNLayers = React.memo(({ structure, style, model }) => {
  const { scale } = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: {
      mass: 4,
      tension: 120,
      friction: 30,
      clamp: false,
    },
  });

  // Calculate positions assuming all layers are expanded
  const { positions, totalHeight } = useMemo(() => {
    let currentY = 0;
    const positions = [];

    structure.forEach((layer) => {
      const baseHeight = layer.dimensions[1];
      const layerGap = 10; // Keep original small gap

      // Always calculate as if expanded (multiply by 2)
      if (layer.sublayers) {
        const sublayerHeight = Math.max(
          ...layer.sublayers.map((sublayer) => sublayer.dimensions[1])
        );
        positions.push(currentY);
        currentY += sublayerHeight * 2 + layerGap;
      } else {
        positions.push(currentY);
        currentY += baseHeight * 2 + layerGap;
      }
    });

    return {
      positions,
      totalHeight: currentY,
    };
  }, [structure]); // Remove layerStates dependency

  // Center offset for the entire structure
  const centerOffset = totalHeight / 2;

  return (
    <animated.group scale={scale}>
      {structure.map((layer, i) => {
        const y = positions[i] - centerOffset;

        if (layer.sublayers) {
          return (
            <CompositeLayer
              key={`${model}-layer-${i}`}
              position={[0, y, 0]}
              layer={layer}
              style={style}
              model={model}
            />
          );
        }

        return (
          <CNNLayer
            key={`${model}-layer-${i}`}
            position={[0, y, 0]}
            layer={layer}
            style={style}
            model={model}
          />
        );
      })}
    </animated.group>
  );
});

const CNNLayer = React.memo(({ position, layer, style, model, onExpand }) => {
  const [expanded, setExpanded] = useState(false);
  const { isProjector } = useScreenStore();
  const [error, setError] = useState(null);

  // Use interval for expansion toggle instead of one-time expansion
  useEffect(() => {
    const toggleExpanded = () => {
      setExpanded((prev) => !prev);
      onExpand?.(!expanded);
    };

    const minInterval = 1000;
    const maxInterval = 8000;
    const randomInterval =
      Math.random() * (maxInterval - minInterval) + minInterval;

    const timer = setInterval(toggleExpanded, randomInterval);

    return () => clearInterval(timer);
  }, [onExpand]);

  try {
    // More permissive validation for FC layers
    if (!layer?.dimensions || !Array.isArray(layer.dimensions)) {
      console.error("Invalid layer dimensions:", layer);
      return null;
    }

    // Special handling for FC and output layers which might have different dimension structures
    const isFCOrOutput = layer.type === "fc" || layer.type === "output";
    if (isFCOrOutput) {
      if (layer.dimensions.length < 1) {
        console.error("Invalid FC/output layer dimensions:", layer);
        return null;
      }
    } else {
      // Regular layer validation
      if (layer.dimensions.length < 3) {
        console.error("Invalid layer dimensions:", layer);
        return null;
      }
    }

    if (
      !layer?.zSpan ||
      !Array.isArray(layer.zSpan) ||
      layer.zSpan.length < 2
    ) {
      console.error("Invalid layer zSpan:", layer);
      return null;
    }

    const { smoothedExpanded } = useSpring({
      smoothedExpanded: expanded ? 1 : 0,
      config: { mass: 1, tension: 120, friction: 13 },
    });

    const gridConfig = GRID_CONFIGS[model] || {};
    let gridTypeConfig = gridConfig[layer.type] || {
      xCount: layer.zSpan[0],
      yCount: layer.zSpan[1],
      xInterval: layer.dimensions[0] * 0.6,
      yInterval: layer.dimensions[1] * 0.6,
    };

    gridTypeConfig.xInterval = layer.dimensions[0] * 0.54;
    gridTypeConfig.yInterval = layer.dimensions[1] * 0.54;

    const grid = {
      xCount: gridTypeConfig.xCount,
      yCount: gridTypeConfig.yCount,
      xInterval: gridTypeConfig.xInterval,
      yInterval: gridTypeConfig.yInterval,
    };

    // const layerColor = style?.colors?.inner || '#fff'
    const layerColor = getLayerColor(
      style?.colors?.inner || "hsl(180, 70%, 50%)", // Default color if none provided
      layer.index || 0,
      layer.type
    );

    // Add depth effect when expanded
    const getLayerDepth = (expanded, layerType) => {
      const baseDepth = expanded ? 2 : 1;
      switch (layerType) {
        case "conv":
          return baseDepth * 1.5;
        case "pool":
          return baseDepth * 0.8;
        case "fc":
          return baseDepth * 0.5;
        default:
          return baseDepth;
      }
    };

    const depthMultiplier = getLayerDepth(expanded, layer.type);

    // Modify node configuration
    const node = {
      size: [
        layer.dimensions[0] * 0.5,
        layer.dimensions[1] * 0.5,
        layer.dimensions[2] * 0.5 * depthMultiplier, // Apply depth multiplier
      ],
      wireframeDivision: expanded ? 2 : 1, // More detailed wireframe when expanded
    };

    const unexpandedNode = {
      size: [
        layer.dimensions[0],
        layer.dimensions[1],
        Math.max(layer.dimensions[2] * 0.1, 0.5) * depthMultiplier,
      ],
      wireframeDivision: 1,
    };

    return (
      <group position={position}>
        <animated.group
          scale-x={smoothedExpanded}
          scale-y={smoothedExpanded}
          scale-z={smoothedExpanded}
        >
          <InstancedNodes
            {...grid}
            node={node}
            color={layerColor}
            style={{
              ...style,
              material: {
                ...style.material,
                roughness: expanded ? 0.3 : style.material.roughness,
                metalness: expanded ? 0.8 : style.material.metalness,
              },
            }}
            isProjector={isProjector}
          />
        </animated.group>
        <animated.group
          scale-x={smoothedExpanded.to((v) => 1 - v)}
          scale-y={smoothedExpanded.to((v) => 1 - v)}
          scale-z={smoothedExpanded.to((v) => 1 - v)}
        >
          <Node
            {...unexpandedNode}
            color={layerColor}
            style={style}
            isProjector={isProjector}
          />
        </animated.group>
      </group>
    );
  } catch (err) {
    console.error("Error rendering CNNLayer:", err, { layer, model });
    return null;
  }
});

const CompositeLayer = React.memo(
  ({ position, layer, style, model, onExpand }) => {
    if (!layer?.sublayers || !Array.isArray(layer.sublayers)) {
      console.error("Invalid composite layer structure:", layer);
      return null;
    }

    try {
      const sublayerGap = 10;
      const sublayerWidths = layer.sublayers.map(
        (sublayer) => sublayer?.dimensions?.[0] ?? 0
      );

      const totalWidth =
        sublayerWidths.reduce((sum, width) => sum + width, 0) +
        (layer.sublayers.length - 1) * sublayerGap;

      let accumulatedWidth = -totalWidth / 2;

      return (
        <group position={position}>
          {layer.sublayers.map((sublayer, idx) => {
            if (!sublayer?.dimensions?.[0]) {
              console.error("Invalid sublayer dimensions:", sublayer);
              return null;
            }

            const x =
              accumulatedWidth +
              sublayer.dimensions[0] / 2 +
              (idx > 0 ? sublayerGap : 0);
            accumulatedWidth += sublayer.dimensions[0] + sublayerGap;

            return (
              <CNNLayer
                key={`${layer.name}-sublayer-${idx}`}
                position={[x, 0, 0]}
                layer={sublayer}
                style={style}
                model={model}
                onExpand={(expanded) => {
                  onExpand?.(expanded);
                }}
              />
            );
          })}
        </group>
      );
    } catch (err) {
      console.error("Error rendering CompositeLayer:", err, { layer, model });
      return null;
    }
  }
);

export default CNNLayers;
