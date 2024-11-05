import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import * as Tone from "tone";
import { useSimulation } from "./useSimulation";
import {
  DURATION,
  getVersionColor,
  getMajorVersion,
  LAYOUT,
  VISUAL,
  ANIMATION,
} from "./constants";
import { DATA_NODES_LINKS } from "@/components/controller/constant/models/rhizome-v4";
import useScreenStore from "@/components/screen/store";
import * as S from "./styles";

export default function Rhizome() {
  const { currentArchitectures } = useScreenStore();
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const synthRef = useRef(null);
  const nodePositionsRef = useRef(new Map());
  const listRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Simplified data transformation
  const data = useMemo(
    () => ({
      nodes: DATA_NODES_LINKS.nodes.map((node) => ({
        ...node,
        id: node.name,
        text: node.name,
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
    if (!simulationRef.current || !nodesRef.current || !linksRef.current)
      return;

    const simulation = simulationRef.current;
    const { width: boundaryWidth, height: boundaryHeight } =
      boundaryRef.current;

    // Reset all nodes to default state first
    nodesRef.current
      .selectAll("circle")
      .transition()
      .duration(DURATION)
      .attr("fill", (d) => getVersionColor(d.majorVersion))
      .attr("opacity", VISUAL.NODE.DEFAULT.OPACITY)
      .attr("r", VISUAL.NODE.DEFAULT.RADIUS)
      .attr("stroke", (d) =>
        d.majorVersion
          ? d3.color(getVersionColor(d.majorVersion)).darker(0.5)
          : "none"
      )
      .attr("stroke-width", VISUAL.NODE.DEFAULT.STROKE_WIDTH);

    nodesRef.current
      .selectAll("text")
      .transition()
      .duration(DURATION)
      .attr("font-size", VISUAL.NODE.DEFAULT.FONT_SIZE)
      .attr("fill", "hsla(180, 100%, 50%, 0.2)");

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

        // Highlight main node
        nodeToHighlight
          .select("circle")
          .transition()
          .duration(DURATION)
          .attr("fill", (d) => d3.color(d.color).brighter(1.2))
          .attr("opacity", VISUAL.NODE.HIGHLIGHTED.OPACITY)
          .attr("r", VISUAL.NODE.HIGHLIGHTED.RADIUS)
          .attr("stroke", "rgba(255, 255, 255, 0.9)")
          .attr("stroke-width", VISUAL.NODE.HIGHLIGHTED.STROKE_WIDTH);

        nodeToHighlight
          .select("text")
          .transition()
          .duration(DURATION)
          .attr("font-size", VISUAL.NODE.HIGHLIGHTED.FONT_SIZE)
          .attr("fill", "hsla(180, 100%, 50%, 0.95)")
          .style("text-shadow", "0 0 8px rgba(255, 255, 255, 0.5)");

        // Highlight connected nodes
        nodesRef.current.each(function (d) {
          if (connectedNodes.has(d.text)) {
            d3.select(this)
              .select("circle")
              .transition()
              .duration(DURATION)
              .attr("r", VISUAL.NODE.SUB_HIGHLIGHTED.RADIUS)
              .attr("opacity", VISUAL.NODE.SUB_HIGHLIGHTED.OPACITY)
              .attr("stroke-width", VISUAL.NODE.SUB_HIGHLIGHTED.STROKE_WIDTH);

            d3.select(this)
              .select("text")
              .transition()
              .duration(DURATION)
              .attr("font-size", VISUAL.NODE.SUB_HIGHLIGHTED.FONT_SIZE)
              .attr("fill", "hsla(180, 100%, 50%, 0.8)");
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
      const intervalId = setInterval(
        scrollToNextItem,
        ANIMATION.SCROLL_INTERVAL
      );

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [relatedModels]);

  return (
    <S.Container>
      {/* <video src="/videos/test.mp4" autoPlay loop muted /> */}

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
