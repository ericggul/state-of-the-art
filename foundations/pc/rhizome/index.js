import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { useSimulation } from "./useSimulation";
import { useRelatedModels } from "./hooks/useRelatedModels";
import RelatedPanel from "./components/RelatedPanel";
import {
  DURATION,
  getVersionColor,
  getMajorVersion,
  LAYOUT,
  VISUAL,
  ANIMATION,
  KEY_HUE,
} from "./constants";
import { DATA_NODES_LINKS } from "@/components/controller/constant/rhizome";
import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";
import * as S from "./styles";

import Frame from "@/foundations/pc/frame/full";

export default function Rhizome() {
  const currentArchitectures = useScreenStore(
    (state) => state.currentArchitectures
  );
  const targetHue = currentArchitectures?.[0]?.hue ?? 230; // Default to 230 if no hue specified
  const debouncedHue = useDebounce(targetHue, 100);

  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const synthRef = useRef(null);
  const nodePositionsRef = useRef(new Map());

  // Simplified data transformation
  const data = useMemo(
    () => ({
      nodes: DATA_NODES_LINKS.nodes.map((node) => ({
        ...node,
        id: node.name,
        text: node.name, // Apply the sanitizer here
        majorVersion: getMajorVersion(node.version),
        color: getVersionColor(getMajorVersion(node.version)),
      })),
      links: DATA_NODES_LINKS.links.map((link) => ({
        ...link,
        source: DATA_NODES_LINKS.nodes[link.source - 1].name,
        target: DATA_NODES_LINKS.nodes[link.target - 1].name,
        value: link.value,
        isCycle: false,
      })),
    }),
    []
  );

  const { simulationRef, nodesRef, linksRef, boundaryRef } = useSimulation(
    svgRef,
    dimensions,
    data,
    debouncedHue
  );

  // Play sound on architecture change
  useEffect(() => {
    if (synthRef.current && currentArchitectures?.length) {
      try {
        synthRef.current.triggerAttackRelease("C3", "16n");
      } catch (e) {
        console.error("Error playing sound:", e);
      }
    }
  }, [currentArchitectures]);

  // Resize observer
  useEffect(() => {
    if (!svgRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(svgRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Highlighting effect
  useEffect(() => {
    if (!simulationRef.current || !nodesRef.current || !linksRef.current)
      return;

    const simulation = simulationRef.current;
    const { width: boundaryWidth, height: boundaryHeight } =
      boundaryRef.current;

    // Reset all nodes to default state first (text at bottom)
    nodesRef.current
      .selectAll("circle")
      .transition()
      .duration(DURATION)
      .attr("fill", (d) => getVersionColor(d.majorVersion, debouncedHue))
      .attr("opacity", VISUAL.NODE.DEFAULT.OPACITY)
      .attr("r", VISUAL.NODE.DEFAULT.RADIUS)
      .attr("stroke-width", 0);
    // .attr("stroke-width", VISUAL.NODE.DEFAULT.STROKE_WIDTH);

    nodesRef.current
      .selectAll("text")
      .transition()
      .duration(DURATION)
      .attr("x", 0)
      .attr("y", (d) => VISUAL.NODE.DEFAULT.RADIUS + window.innerHeight * 0.015)
      .attr("text-anchor", "middle")
      .attr("font-size", VISUAL.NODE.DEFAULT.FONT_SIZE)
      .attr("fill", `hsla(${debouncedHue}, 10%, 50%, 1)`);

    // Reset all links to default state
    linksRef.current
      .transition()
      .duration(DURATION)
      .attr("opacity", VISUAL.LINK.OPACITY)
      .attr("stroke-width", VISUAL.LINK.STROKE_WIDTH);

    if (currentArchitectures?.length) {
      const currentNode = currentArchitectures[0].name;
      const nodeToHighlight = nodesRef.current.filter(
        (d) => d.text === currentNode
      );

      if (!nodeToHighlight.empty()) {
        // Find connected nodes
        const connectedNodes = new Set();
        linksRef.current.each((link) => {
          if (link.source.text === currentNode)
            connectedNodes.add(link.target.text);
          if (link.target.text === currentNode)
            connectedNodes.add(link.source.text);
        });

        // Highlight main node (text at top - keep as is)
        nodeToHighlight
          .select("circle")
          .transition()
          .duration(DURATION)
          .attr("fill", (d) => getVersionColor(d.majorVersion, debouncedHue))
          .attr("opacity", VISUAL.NODE.HIGHLIGHTED.OPACITY)
          .attr("r", 3)
          .attr("stroke-width", 0);

        nodeToHighlight
          .select("text")
          .transition()
          .duration(DURATION)
          .attr("x", 0)
          .attr(
            "y",
            (d) => -VISUAL.NODE.HIGHLIGHTED.RADIUS - window.innerHeight * 0.03
          )
          .attr("text-anchor", "middle")
          .attr("font-size", VISUAL.NODE.HIGHLIGHTED.FONT_SIZE)
          .attr("fill", `hsla(${debouncedHue}, 10%, 90%, 0.95)`)
          .attr("opacity", 1)
          .style("text-shadow", "0 0 8px rgba(255, 255, 255, 0.5)");

        // Highlight connected nodes (text at bottom)
        nodesRef.current.each(function (d) {
          if (connectedNodes.has(d.text)) {
            // d3.select(this)
            //   .select("circle")
            //   .transition()
            //   .duration(DURATION)
            //   .attr("r", 3)
            //   .attr("stroke-width", 0);

            d3.select(this)
              .select("text")
              .transition()
              .duration(DURATION)
              .attr("x", 0)
              .attr(
                "y",
                (d) =>
                  VISUAL.NODE.SUB_HIGHLIGHTED.RADIUS + window.innerHeight * 0.02
              )
              .attr("text-anchor", "middle")
              .attr("font-size", VISUAL.NODE.SUB_HIGHLIGHTED.FONT_SIZE)
              .attr("fill", `hsla(${debouncedHue}, 10%, 90%, 0.8)`)
              .attr("opacity", 1);
          }
        });

        // Highlight connected links
        linksRef.current.each(function (link) {
          if (
            link.source.text === currentNode ||
            link.target.text === currentNode
          ) {
            d3.select(this)
              .transition()
              .duration(DURATION)
              .attr("opacity", VISUAL.LINK.HIGHLIGHTED.OPACITY)
              .attr("stroke-width", VISUAL.LINK.HIGHLIGHTED.STROKE_WIDTH);
          }
        });

        // Continue with the force simulation logic...
        simulation.force("centerHighlighted", (alpha) => {
          const k = alpha * LAYOUT.HIGHLIGHT.FORCE.STRENGTH;
          const targetX = boundaryWidth * LAYOUT.HIGHLIGHT.TARGET.X_FACTOR;
          const targetY = -boundaryHeight * LAYOUT.HIGHLIGHT.TARGET.Y_FACTOR;
          const verticalSpread =
            boundaryRef.current.height / LAYOUT.VERTICAL_SPREAD_FACTOR;

          // Get the current highlighted node data
          const highlightedNode = data.nodes.find(
            (node) => node.text === currentArchitectures?.[0]?.name
          );

          data.nodes.forEach((node) => {
            if (!nodePositionsRef.current.has(node.id)) {
              nodePositionsRef.current.set(
                node.id,
                (Math.random() - 0.5) * verticalSpread * 2
              );
            }
            const randomY = nodePositionsRef.current.get(node.id);
            const jitter = (Math.random() - 0.5) * ANIMATION.JITTER;

            if (node === highlightedNode) {
              const dx = targetX - node.x + jitter;
              const dy = targetY - node.y + jitter;
              node.vx += dx * k;
              node.vy += dy * k * LAYOUT.HIGHLIGHT.FORCE.VERTICAL_FACTOR;
            } else {
              const isConnected = data.links.some(
                (link) =>
                  (link.source === highlightedNode && link.target === node) ||
                  (link.target === highlightedNode && link.source === node)
              );

              if (isConnected) {
                const dx =
                  boundaryWidth * LAYOUT.HIGHLIGHT.CONNECTED.X_FACTOR -
                  node.x +
                  jitter;
                const dy =
                  randomY * LAYOUT.HIGHLIGHT.CONNECTED.Y_SPREAD -
                  node.y +
                  jitter;
                node.vx += dx * k * LAYOUT.HIGHLIGHT.FORCE.CONNECTED_FACTOR;
                node.vy += dy * k * LAYOUT.HIGHLIGHT.FORCE.CONNECTED_FACTOR;
              } else {
                const dx =
                  boundaryWidth * LAYOUT.HIGHLIGHT.UNCONNECTED.X_FACTOR -
                  node.x +
                  jitter;
                const dy =
                  randomY * LAYOUT.HIGHLIGHT.UNCONNECTED.Y_SPREAD -
                  node.y +
                  jitter;
                node.vx += dx * k * LAYOUT.HIGHLIGHT.FORCE.UNCONNECTED_FACTOR;
                node.vy += dy * k * LAYOUT.HIGHLIGHT.FORCE.UNCONNECTED_FACTOR;
              }
            }
          });
        });

        // Continue with the force simulation logic...
        simulation
          .alpha(ANIMATION.ALPHA.INITIAL)
          .alphaTarget(ANIMATION.ALPHA.TARGET)
          .restart();
      }
    } else {
      // When no node is selected, maintain some movement
      simulation
        .alpha(ANIMATION.ALPHA.IDLE)
        .alphaTarget(ANIMATION.ALPHA.IDLE)
        .restart();
    }
  }, [currentArchitectures, dimensions, data, debouncedHue]);

  // Clear positions on selection change
  useEffect(() => {
    nodePositionsRef.current.clear();
  }, [currentArchitectures]);

  const relatedModels = useRelatedModels(currentArchitectures);

  return (
    <S.Container>
      <svg ref={svgRef} width="100vw" height="100vh" />
      {currentArchitectures?.length > 0 && (
        <RelatedPanel
          currentModel={currentArchitectures[0].name}
          relatedModels={relatedModels}
          hue={debouncedHue}
        />
      )}
      <Frame isCondensed={true} />
    </S.Container>
  );
}
