import React, { useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";
import { MODELS, LAYER_CONFIGS } from "@/foundations/frontend/arch-models";
import useScreenStore from "@/components/screen/store";
import * as S from "./styles";

export default function ArchitectureVis() {
  const { currentArchitectures } = useScreenStore();

  if (!currentArchitectures || currentArchitectures.length === 0) {
    return <S.Container>No architecture selected</S.Container>;
  }

  return (
    <S.Container>
      <ArchitectureVisualization
        currentArchitecture={currentArchitectures[0]}
      />
    </S.Container>
  );
}

const ArchitectureVisualization = ({ currentArchitecture }) => {
  const svgRef = useRef(null);

  const { layers, config } = useMemo(() => {
    if (!currentArchitecture || !currentArchitecture.name) {
      return { layers: [], config: {} };
    }

    const modelName = currentArchitecture.name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_");
    const modelData = MODELS[modelName];
    const layerConfig = LAYER_CONFIGS[modelName];

    if (!modelData || !layerConfig) {
      console.error(`Model data not found for architecture: ${modelName}`);
      return { layers: [], config: {} };
    }

    return { layers: modelData, config: layerConfig };
  }, [currentArchitecture]);

  useEffect(() => {
    if (!layers.length || !config) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = window.innerWidth;
    const height = window.innerHeight;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g");

    const colorScale = d3
      .scaleOrdinal()
      .range(["#00ffff", "#0080ff", "#ff00ff", "#8000ff", "#ff8000"]);

    const maxDepth = getMaxDepth(layers);
    const layerWidth = width / (maxDepth + 1);

    function getMaxDepth(layers, depth = 0) {
      return layers.reduce((max, layer) => {
        const currentDepth = layer.sublayers
          ? getMaxDepth(layer.sublayers, depth + 1)
          : depth;
        return Math.max(max, currentDepth);
      }, depth);
    }

    function drawLayer(layer, x, y, width, height, depth = 0) {
      const group = g.append("g").attr("transform", `translate(${x},${y})`);

      group
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "rgba(0, 128, 255, 0.1)")
        .attr("stroke", colorScale(layer.type))
        .attr("stroke-width", 2)
        .attr("rx", 10)
        .attr("ry", 10);

      group
        .append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#00ffff")
        .attr("font-family", "'Orbitron', sans-serif")
        .text(layer.name);

      if (layer.sublayers) {
        const sublayerCount = layer.sublayers.length;
        const sublayerHeight = height / sublayerCount;

        layer.sublayers.forEach((sublayer, i) => {
          drawLayer(
            sublayer,
            x + layerWidth,
            y + i * sublayerHeight,
            width * 0.9,
            sublayerHeight * 0.9,
            depth + 1
          );
        });

        // Connect parent to sublayers
        layer.sublayers.forEach((sublayer, i) => {
          g.append("path")
            .attr(
              "d",
              `M${x + width},${y + height / 2} C${x + width + layerWidth / 2},${
                y + height / 2
              } ${x + layerWidth / 2},${
                y + i * sublayerHeight + sublayerHeight / 2
              } ${x + layerWidth},${
                y + i * sublayerHeight + sublayerHeight / 2
              }`
            )
            .attr("stroke", colorScale(layer.type))
            .attr("stroke-width", 2)
            .attr("fill", "none");
        });
      }
    }

    const layerHeight = height / layers.length;

    layers.forEach((layer, i) => {
      drawLayer(layer, 0, i * layerHeight, layerWidth, layerHeight * 0.9, 0);
    });
  }, [layers, config]);

  if (!layers.length || !config) {
    return (
      <S.NoDataMessage>
        No valid data available for visualization
      </S.NoDataMessage>
    );
  }

  return <S.SVGContainer ref={svgRef}></S.SVGContainer>;
};
