import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import * as Tone from "tone";
import { useSimulation } from "./useSimulation";
import { DURATION, getVersionColor, getMajorVersion } from "./constants";
import { DATA_NODES_LINKS } from "@/components/controller/constant/models/rhizome-v4";
import useScreenStore from "@/components/screen/store";
import * as S from "./styles";

// Function to identify and remove redundant links while keeping the exact same format
const cleanRedundantLinks = (links) => {
  // Map to track unique connections using both directions
  const connectionMap = new Map();

  // First pass - identify all connections and keep the one with higher value
  links.forEach((link) => {
    const key = [link.source, link.target].sort((a, b) => a - b).join("-");

    if (!connectionMap.has(key) || connectionMap.get(key).value < link.value) {
      connectionMap.set(key, link);
    }
  });

  // Convert back to array and preserve original format
  const cleanedLinks = Array.from(connectionMap.values());

  // Sort by ID to maintain order
  cleanedLinks.sort((a, b) => a.id - b.id);

  // Reassign sequential IDs while keeping everything else identical
  return cleanedLinks.map((link, index) => ({
    ...link,
    id: index + 1,
  }));
};

export default function Rhizome() {
  const { currentArchitectures } = useScreenStore();
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const synthRef = useRef(null);
  const nodePositionsRef = useRef(new Map());
  const listRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Transform data once
  const data = useMemo(() => {
    const cleanedLinks = cleanRedundantLinks(DATA_NODES_LINKS.links);

    console.log("Original links count:", DATA_NODES_LINKS.links.length);
    console.log("Cleaned links count:", cleanedLinks.length);
    console.log(
      "Removed duplicates:",
      DATA_NODES_LINKS.links.length - cleanedLinks.length
    );
    console.log("Cleaned links:", cleanedLinks);

    return {
      nodes: DATA_NODES_LINKS.nodes.map((node) => ({
        ...node,
        id: node.name,
        text: node.name,
        majorVersion: getMajorVersion(node.version),
        color: getVersionColor(getMajorVersion(node.version)),
      })),
      links: cleanedLinks.map((link) => {
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
    };
  }, []);

  console.log(data);

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
    const { width: boundaryWidth, height: boundaryHeight } =
      boundaryRef.current;

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
      .attr("r", 1)
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
          const k = alpha * 1.2;
          const highlightedNode = nodeToHighlight.datum();
          const targetX = boundaryWidth * 0.5;
          const targetY = -boundaryHeight * 0.6;
          const verticalSpread = boundaryRef.current.height / 1.5;

          data.nodes.forEach((node) => {
            if (!nodePositionsRef.current.has(node.id)) {
              nodePositionsRef.current.set(
                node.id,
                (Math.random() - 0.5) * verticalSpread * 2
              );
            }
            const randomY = nodePositionsRef.current.get(node.id);
            const jitter = (Math.random() - 0.5) * 0.2;

            if (node === highlightedNode) {
              const dx = targetX - node.x + jitter;
              const dy = targetY - node.y + jitter;
              node.vx += dx * k;
              node.vy += dy * k * 0.4;
            } else {
              const isConnected = data.links.some(
                (link) =>
                  (link.source === highlightedNode && link.target === node) ||
                  (link.target === highlightedNode && link.source === node)
              );

              if (isConnected) {
                const dx = boundaryWidth * -0.3 - node.x + jitter;
                const dy = randomY * 0.5 - node.y + jitter;
                node.vx += dx * k * 0.5;
                node.vy += dy * k * 0.3;
              } else {
                const dx = boundaryWidth * -0.4 - node.x + jitter;
                const dy = randomY * 0.7 - node.y + jitter;
                node.vx += dx * k * 0.4;
                node.vy += dy * k * 0.3;
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

  // Get related models and their relationships
  const relatedModels = useMemo(() => {
    if (!currentArchitectures?.length) return [];

    const currentModel = currentArchitectures[0].name;
    const nodeMap = new Map(
      DATA_NODES_LINKS.nodes.map((node) => [node.id, node])
    );

    return DATA_NODES_LINKS.links
      .filter((link) => {
        const sourceNode = nodeMap.get(link.source);
        const targetNode = nodeMap.get(link.target);
        return (
          (sourceNode?.name === currentModel ||
            targetNode?.name === currentModel) &&
          link.relation
        );
      })
      .map((link) => {
        const sourceNode = nodeMap.get(link.source);
        const targetNode = nodeMap.get(link.target);
        const connectedNode =
          sourceNode?.name === currentModel ? targetNode : sourceNode;

        return {
          name: connectedNode?.name || "",
          relation: link.relation,
          value: link.value,
          version: connectedNode?.version,
        };
      })
      .filter((model) => model.name) // Remove any invalid entries
      .sort((a, b) => b.value - a.value);
  }, [currentArchitectures]);

  console.log("Related Models:", relatedModels);

  // Auto-scroll animation
  useEffect(() => {
    if (listRef.current && relatedModels.length > 0) {
      const list = listRef.current;
      let currentIndex = 1;

      const scrollToNextItem = () => {
        const items = list.children;
        if (currentIndex >= items.length) {
          // Reset to top when reaching the end
          currentIndex = 1;
          list.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } else {
          // Scroll to next item
          const nextItem = items[currentIndex];
          nextItem.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          currentIndex++;
        }
      };

      // Initial scroll to top
      list.scrollTo({ top: 0 });

      // Set up interval for scrolling
      const intervalId = setInterval(scrollToNextItem, 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [relatedModels]);

  return (
    <S.Container>
      <svg ref={svgRef} width="100%" height="100%" />
      {currentArchitectures?.length > 0 && relatedModels.length > 0 && (
        <S.RelatedPanel>
          <S.PanelTitle>
            Connected to {currentArchitectures[0].name}
          </S.PanelTitle>
          <S.RelatedList ref={listRef}>
            {relatedModels.map((model, index) => (
              <S.RelatedItem key={index} $strength={model.value / 10}>
                <S.ModelHeader>
                  <S.ModelName>{model.name}</S.ModelName>
                  <S.ModelVersion>{model.version}</S.ModelVersion>
                </S.ModelHeader>
                <S.RelationText>{model.relation}</S.RelationText>
                <S.ConnectionStrength $value={model.value / 10} />
              </S.RelatedItem>
            ))}
          </S.RelatedList>
        </S.RelatedPanel>
      )}
    </S.Container>
  );
}
