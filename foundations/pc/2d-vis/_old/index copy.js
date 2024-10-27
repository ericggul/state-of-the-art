import React, { useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";
import { MODELS, LAYER_CONFIGS } from "@/foundations/frontend/arch-models";
import useScreenStore from "@/components/screen/store";
import * as S from "../styles";

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

    const width = 1000;
    const height = calculateTotalHeight(layers);
    const padding = 20;
    const layerWidth = 200;

    svg.attr("width", width).attr("height", height);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    function drawLayer(layer, x, y, width, height) {
      const group = svg.append("g");
      group
        .append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", colorScale(layer.type))
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      group
        .append("text")
        .attr("x", x + width / 2)
        .attr("y", y + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(`${layer.name} (${layer.type})`);

      if (layer.dimensions) {
        group
          .append("text")
          .attr("x", x + width / 2)
          .attr("y", y + 40)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .text(`Dim: ${layer.dimensions.join("x")}`);
      }

      return height;
    }

    function drawSublayers(sublayers, x, y, width) {
      let totalHeight = 0;
      sublayers.forEach((sublayer) => {
        const sublayerHeight = sublayer.sublayers
          ? drawSublayers(
              sublayer.sublayers,
              x + 20,
              y + totalHeight,
              width - 20
            )
          : drawLayer(sublayer, x + 20, y + totalHeight, width - 20, 60);
        totalHeight += sublayerHeight + padding;
      });
      return totalHeight;
    }

    let yOffset = padding;
    layers.forEach((layer) => {
      const layerHeight = layer.sublayers
        ? drawSublayers(layer.sublayers, padding, yOffset, layerWidth)
        : drawLayer(layer, padding, yOffset, layerWidth, 60);
      yOffset += layerHeight + padding;
    });
  }, [layers, config]);

  function calculateTotalHeight(layers) {
    let totalHeight = 0;
    function calcHeight(layer) {
      if (layer.sublayers) {
        return (
          layer.sublayers.reduce(
            (acc, sublayer) => acc + calcHeight(sublayer),
            0
          ) + 20
        );
      }
      return 80;
    }
    layers.forEach((layer) => {
      totalHeight += calcHeight(layer) + 20;
    });
    return totalHeight;
  }

  if (!layers.length || !config) {
    return <div>No valid data available for visualization</div>;
  }

  return <svg ref={svgRef}></svg>;
};
