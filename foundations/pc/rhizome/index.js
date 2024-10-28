import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import * as Tone from "tone";
import { useSimulation } from "./useSimulation";
import { DURATION, getVersionColor, getMajorVersion } from "./constants";
import { DATA_NODES_LINKS } from "@/components/controller/constant/models/rhizome";
import useScreenStore from "@/components/screen/store";
import * as S from "./styles";

export default function Rhizome() {
  const { currentArchitectures } = useScreenStore();
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const synthRef = useRef(null);
  const nodePositionsRef = useRef(new Map());

  // Transform data once
  const data = useMemo(
    () => ({
      nodes: DATA_NODES_LINKS.nodes.map((node) => ({
        ...node,
        id: node.name,
        text: node.name,
        majorVersion: getMajorVersion(node.version),
        color: getVersionColor(getMajorVersion(node.version)),
      })),
      links: DATA_NODES_LINKS.links.map((link) => {
        const sourceNode = DATA_NODES_LINKS.nodes[link.source - 1];
        const targetNode = DATA_NODES_LINKS.nodes[link.target - 1];
        return {
          ...link,
          source: sourceNode.name,
          target: targetNode.name,
          value: link.value,
          isCycle: false,
        };
      }),
    }),
    []
  );

  const { simulationRef, nodesRef, linksRef, boundaryRef } = useSimulation(
    svgRef,
    dimensions,
    data
  );

  // Initialize Tone.js synth
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = new Tone.MembraneSynth().toDestination();
      synthRef.current.volume.value = -5;
    }
    return () => {
      if (synthRef.current) synthRef.current.dispose();
    };
  }, []);

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
    if (!simulationRef.current || !nodesRef.current) return;

    const simulation = simulationRef.current;
    const { width: boundaryWidth } = boundaryRef.current;

    // First, reset ALL nodes to their default state
    nodesRef.current
      .selectAll("circle")
      .transition()
      .duration(DURATION)
      .attr("fill", (d) => getVersionColor(d.majorVersion)) // Changed from d.color
      .attr("opacity", 0.7)
      .attr("r", 5)
      .attr("stroke", (d) =>
        d.majorVersion
          ? d3.color(getVersionColor(d.majorVersion)).darker(0.5)
          : "none"
      )
      .attr("stroke-width", 1);

    nodesRef.current
      .selectAll("text")
      .transition()
      .duration(DURATION)
      .attr("font-size", "1.2vw")
      .attr("fill", "rgba(255, 255, 255, 0.5)");

    // Only proceed with highlighting if there's a selected architecture
    if (currentArchitectures?.length) {
      const currentNode = currentArchitectures[0].name;
      const nodeToHighlight = nodesRef.current.filter(
        (d) => d.text === currentNode
      );

      if (!nodeToHighlight.empty()) {
        simulation.force("centerHighlighted", (alpha) => {
          const k = alpha * 0.3;
          const highlightedNode = nodeToHighlight.datum();
          const targetX = boundaryWidth / 1.0;
          const verticalSpread = boundaryRef.current.height / 3;

          data.nodes.forEach((node) => {
            if (!nodePositionsRef.current.has(node.id)) {
              nodePositionsRef.current.set(
                node.id,
                (Math.random() - 0.5) * verticalSpread
              );
            }
            const targetY = nodePositionsRef.current.get(node.id);

            if (node === highlightedNode) {
              const dx = targetX - node.x;
              const dy = targetY - node.y;
              node.vx += dx * k;
              node.vy += dy * k * 0.08;
            } else {
              const isConnected = data.links.some(
                (link) =>
                  (link.source === highlightedNode && link.target === node) ||
                  (link.target === highlightedNode && link.source === node)
              );

              if (isConnected) {
                const dx = targetX - boundaryWidth / 3 - node.x;
                const dy = targetY - node.y;
                node.vx += dx * k * 0.5;
                node.vy += dy * k * 0.08;
              } else {
                const dx = -boundaryWidth * 0.8 - node.x;
                const dy = targetY - node.y;
                node.vx += dx * k * 0.5;
                node.vy += dy * k * 0.08;
              }
            }
          });
        });

        // Highlight transitions
        nodeToHighlight
          .select("circle")
          .transition()
          .duration(DURATION)
          .attr("fill", (d) => d3.color(d.color).brighter(1.5))
          .attr("opacity", 1)
          .attr("r", 8)
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        nodeToHighlight
          .select("text")
          .transition()
          .duration(DURATION)
          .attr("font-size", "1.5vw")
          .attr("fill", "rgba(255, 255, 255, 1)");

        simulation.alpha(0.3).alphaTarget(0.05).restart();
      }
    }
  }, [currentArchitectures, dimensions, data]);

  // Clear positions on selection change
  useEffect(() => {
    nodePositionsRef.current.clear();
  }, [currentArchitectures]);

  return (
    <S.Container>
      <svg ref={svgRef} width="100%" height="100%" />
    </S.Container>
  );
}
