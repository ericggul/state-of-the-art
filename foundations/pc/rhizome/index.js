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

    // Add continuous wiggle force
    simulation.force("wiggle", (alpha) => {
      const time = Date.now() * 0.001; // Current time in seconds
      data.nodes.forEach((node) => {
        // Create organic movement using sine waves with different frequencies
        const wiggleX = Math.sin(time + node.x * 0.01) * 0.3;
        const wiggleY = Math.cos(time + node.y * 0.01) * 0.3;
        node.vx += wiggleX * alpha;
        node.vy += wiggleY * alpha;
      });
    });

    // Reset nodes state
    nodesRef.current
      .selectAll("circle")
      .transition()
      .duration(DURATION)
      .attr("fill", (d) => getVersionColor(d.majorVersion))
      .attr("opacity", 0.7)
      .attr("r", 3)
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
      .attr("font-size", "0.8vw")
      .attr("fill", "hsla(180, 100%, 50%, 0.2)");

    // Only proceed with highlighting if there's a selected architecture
    if (currentArchitectures?.length) {
      const currentNode = currentArchitectures[0].name;
      const nodeToHighlight = nodesRef.current.filter(
        (d) => d.text === currentNode
      );

      if (!nodeToHighlight.empty()) {
        simulation.force("centerHighlighted", (alpha) => {
          const k = alpha * 0.5;
          const highlightedNode = nodeToHighlight.datum();
          const targetX = boundaryWidth * 0.75;
          const verticalSpread = boundaryRef.current.height / 1.8; // Changed from /2 to /1.8 for more spread

          data.nodes.forEach((node) => {
            if (!nodePositionsRef.current.has(node.id)) {
              nodePositionsRef.current.set(
                node.id,
                (Math.random() - 0.5) * verticalSpread * 2 // Increased multiplier from 1.8 to 2
              );
            }
            const targetY = nodePositionsRef.current.get(node.id);
            const jitter = (Math.random() - 0.5) * 0.5;

            if (node === highlightedNode) {
              const dx = targetX - node.x + jitter;
              const dy = targetY - node.y + jitter;
              node.vx += dx * k;
              node.vy += dy * k * 0.1;
            } else {
              const isConnected = data.links.some(
                (link) =>
                  (link.source === highlightedNode && link.target === node) ||
                  (link.target === highlightedNode && link.source === node)
              );

              if (isConnected) {
                // Connected nodes more towards center
                const dx = boundaryWidth * 0.55 - node.x + jitter;
                const dy = targetY - node.y + jitter;
                node.vx += dx * k * 0.6;
                node.vy += dy * k * 0.1;
              } else {
                // Much more extreme left positioning
                const dx = boundaryWidth * -0.5 - node.x + jitter;
                const dy = targetY - node.y + jitter;
                node.vx += dx * k * 0.6;
                node.vy += dy * k * 0.1;
              }
            }
          });
        });

        // Highlight transitions
        nodeToHighlight
          .select("circle")
          .transition()
          .duration(DURATION)
          .attr("fill", (d) => d3.color(d.color).brighter(1.2))
          .attr("opacity", 1)
          .attr("r", 8)
          .attr("stroke", "rgba(255, 255, 255, 0.9)")
          .attr("stroke-width", 2.5);

        nodeToHighlight
          .select("text")
          .transition()
          .duration(DURATION)
          .attr("font-size", "1.5vw")
          .attr("fill", "hsla(180, 100%, 50%, 0.95)")
          .style("text-shadow", "0 0 8px rgba(255, 255, 255, 0.5)");

        // Increase both alpha and alphaTarget for more continuous movement
        simulation.alpha(0.3).alphaTarget(0.4).restart();
      }
    } else {
      // When no node is selected, maintain some movement
      simulation.alpha(0.2).alphaTarget(0.2).restart();
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
