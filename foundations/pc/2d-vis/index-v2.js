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

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = viewportWidth - margin.left - margin.right;
    const height = viewportHeight - margin.top - margin.bottom;

    svg
      .attr("viewBox", `0 0 ${viewportWidth} ${viewportHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    function drawLayer(layer, x, y, width, height, depth = 0) {
      const group = g.append("g").attr("transform", `translate(${x},${y})`);

      group
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", colorScale(layer.type))
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      group
        .append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(layer.name);

      if (layer.dimensions) {
        group
          .append("text")
          .attr("x", width / 2)
          .attr("y", 40)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .text(`Dim: ${layer.dimensions.join("x")}`);
      }

      if (layer.sublayers) {
        const sublayerHeight = (height - 60) / layer.sublayers.length;
        layer.sublayers.forEach((sublayer, i) => {
          drawLayer(
            sublayer,
            10,
            60 + i * sublayerHeight,
            width - 20,
            sublayerHeight - 5,
            depth + 1
          );
        });
      }

      return height;
    }

    const layerWidth = width / layers.length;
    let maxHeight = 0;

    layers.forEach((layer, i) => {
      const layerHeight = drawLayer(
        layer,
        i * layerWidth,
        0,
        layerWidth - 10,
        height
      );
      maxHeight = Math.max(maxHeight, layerHeight);
    });

    svg.attr("height", maxHeight + margin.top + margin.bottom);
  }, [layers, config]);

  if (!layers.length || !config) {
    return <div>No valid data available for visualization</div>;
  }

  return <svg ref={svgRef} style={{ width: "100%", height: "100vh" }}></svg>;
};
