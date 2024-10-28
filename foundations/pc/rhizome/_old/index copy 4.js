import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import * as S from "./styles";
import { DATA_NODES_LINKS } from "@/components/controller/constant/models/rhizome";
import forceBoundary from "d3-force-boundary";
import useScreenStore from "@/components/screen/store";
import * as Tone from "tone";

const DURATION = 300;

export default function Rhizome() {
  const { currentArchitectures } = useScreenStore();
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentTarget, setCurrentTarget] = useState(null);
  const simulationRef = useRef(null);
  const nodesRef = useRef(null);
  const linksRef = useRef(null);
  const synthRef = useRef(null);
  const boundaryRef = useRef({ width: 0, height: 0 }); // Add this ref to store boundary dimensions
  const nodePositionsRef = useRef(new Map());

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

  // Play sound when currentArchitectures changes
  useEffect(() => {
    if (synthRef.current && currentArchitectures?.length) {
      try {
        synthRef.current.triggerAttackRelease("C3", "16n");
      } catch (e) {
        console.error("Error playing sound:", e);
      }
    }
  }, [currentArchitectures]);

  // Transform data once, not on every render
  const data = useMemo(
    () => ({
      nodes: DATA_NODES_LINKS.nodes.map((node) => ({
        ...node,
        // Use name as the unique identifier consistently
        id: node.name,
        text: node.name,
        majorVersion: node.version
          ? parseInt(node.version.match(/v(\d+)/)?.[1]) || null
          : null,
        color: node.version
          ? getVersionColor(parseInt(node.version.match(/v(\d+)/)?.[1]) || null)
          : "rgba(255, 255, 255, 0.7)",
      })),
      links: DATA_NODES_LINKS.links.map((link) => {
        // Find the actual node names for source and target
        const sourceNode = DATA_NODES_LINKS.nodes[link.source - 1];
        const targetNode = DATA_NODES_LINKS.nodes[link.target - 1];
        return {
          ...link,
          source: sourceNode.name, // Use name instead of index
          target: targetNode.name, // Use name instead of index
          value: link.value,
          isCycle: false,
        };
      }),
    }),
    []
  );

  // Add resize observer to get dimensions
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

  // Don't initialize D3 until we have dimensions
  useEffect(() => {
    if (!svgRef.current || !dimensions.width || !dimensions.height) return;

    // Clear existing SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Calculate and store boundary dimensions
    boundaryRef.current = {
      width: dimensions.width * 0.9,
      height: dimensions.height * 0.9,
    };

    // Create container group and apply zoom
    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${dimensions.width / 2}, ${dimensions.height / 2})`
      );

    // Create the simulation with forces
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3.forceLink(data.links).id((d) => d.name)
      )
      .force("charge", d3.forceManyBody().strength(-400)) // Increased repulsion
      .force(
        "boundary",
        forceBoundary(
          -boundaryRef.current.width / 2,
          -boundaryRef.current.height / 1.5, // Increased vertical space
          boundaryRef.current.width / 2,
          boundaryRef.current.height / 1.5
        )
      )
      .alphaDecay(0.01)
      .velocityDecay(0.3);

    // Add links after nodes are initialized
    simulation.force("link").links(data.links);

    // Add links
    const links = g
      .append("g")
      .selectAll("path")
      .data(data.links)
      .join("path")
      .attr("stroke", (d) => {
        const sourceNode = data.nodes.find((n) => n.name === d.source.name);
        const targetNode = data.nodes.find((n) => n.name === d.target.name);
        if (sourceNode.majorVersion === targetNode.majorVersion) {
          return getVersionColor(sourceNode.majorVersion);
        }
        return "rgba(255, 255, 255, 0.27)";
      })
      .attr("stroke-width", (d) => {
        const sourceNode = data.nodes.find((n) => n.name === d.source.name);
        const targetNode = data.nodes.find((n) => n.name === d.target.name);
        return sourceNode.majorVersion === targetNode.majorVersion ? 1.5 : 1;
      })
      .attr("opacity", 0.27)
      .attr("fill", "none");

    // Add nodes
    const nodes = g
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation));

    // Add circles to nodes
    nodes
      .append("circle")
      .attr("r", 5)
      .attr("id", (d) => `circle-${d.name}`)
      .attr("fill", (d) => getVersionColor(d.majorVersion))
      .attr("stroke", (d) =>
        d.majorVersion
          ? d3.color(getVersionColor(d.majorVersion)).darker(0.5)
          : "none"
      )
      .attr("stroke-width", 1);

    // Add text labels
    nodes
      .append("text")
      .text((d) => d.name)
      .attr("x", 8)
      .attr("y", "0.31em")
      .attr("font-size", "1.2vw")
      .attr("fill", "rgba(255, 255, 255, 0.5)");

    // Update positions on tick
    simulation.on("tick", () => {
      links.attr("d", linkArc);
      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Store refs for later use
    nodesRef.current = nodes;
    linksRef.current = links;
    simulationRef.current = simulation;

    // Add version legend with correct positioning
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${-boundaryRef.current.width * 0.9}, ${
          -boundaryRef.current.height * 0.9
        })`
      );

    const versions = Array.from(
      new Set(data.nodes.map((n) => n.majorVersion).filter(Boolean))
    );
    versions.sort((a, b) => a - b);

    versions.forEach((version, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendItem
        .append("circle")
        .attr("r", 5)
        .attr("fill", getVersionColor(version));

      legendItem
        .append("text")
        .attr("x", 15)
        .attr("y", 5)
        .attr("fill", "white")
        .attr("opacity", 0.7)
        .text(`Version ${version}.x`);
    });
  }, [dimensions, data]);

  // Handle currentArchitectures changes
  useEffect(() => {
    if (!simulationRef.current || !nodesRef.current) return;

    const simulation = simulationRef.current;
    const { width: boundaryWidth } = boundaryRef.current;

    // First, reset ALL nodes to their default state
    nodesRef.current
      .selectAll("circle")
      .transition()
      .duration(DURATION)
      .attr("fill", (d) => d.color)
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
            // Initialize or get vertical position for this node
            if (!nodePositionsRef.current.has(node.id)) {
              nodePositionsRef.current.set(
                node.id,
                (Math.random() - 0.5) * verticalSpread
              );
            }
            const targetY = nodePositionsRef.current.get(node.id);

            if (node === highlightedNode) {
              // Move highlighted node right
              const dx = targetX - node.x;
              const dy = targetY - node.y;
              node.vx += dx * k;
              node.vy += dy * k * 0.08; // Even gentler vertical force
            } else {
              const isConnected = data.links.some(
                (link) =>
                  (link.source === highlightedNode && link.target === node) ||
                  (link.target === highlightedNode && link.source === node)
              );

              if (isConnected) {
                // Connected nodes in middle-right
                const dx = targetX - boundaryWidth / 3 - node.x;
                const dy = targetY - node.y;
                node.vx += dx * k * 0.5;
                node.vy += dy * k * 0.08;
              } else {
                // Unconnected nodes to far left
                const dx = -boundaryWidth * 0.8 - node.x;
                const dy = targetY - node.y;
                node.vx += dx * k * 0.5;
                node.vy += dy * k * 0.08;
              }
            }
          });
        });

        // Enhanced highlight with smooth transition
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
  }, [currentArchitectures, dimensions]);

  // Clear positions when selection changes
  useEffect(() => {
    nodePositionsRef.current.clear();
  }, [currentArchitectures]);

  // Window resize handler
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <S.Container>
      <svg ref={svgRef} width="100%" height="100%" />
    </S.Container>
  );
}

// Helper functions
function linkArc(d) {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `M${d.source.x},${d.source.y} A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`;
}

function updateNodeHighlight(d, nodes) {
  const circle = d3.select(`#circle-${d.id}`);
  const text = nodes.filter((n) => n.text === d.text).selectAll("text");

  circle.transition().duration(150).attr("fill", "hsl(180, 100%, 93%)");

  text
    .transition()
    .duration(150)
    .attr("x", "1vw")
    .attr("y", ".4vw")
    .attr("font-size", "10vw")
    .attr("fill", "white");
}

function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

// Add these helper functions at the bottom of the file
function getMajorVersion(version) {
  if (!version) return null;
  const match = version.match(/v(\d+)/);
  return match ? parseInt(match[1]) : null;
}

function getVersionColor(majorVersion) {
  const colorScale = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8]).range([
    "hsl(180, 100%, 70%)", // v1 - Teal
    "hsl(120, 100%, 70%)", // v2 - Green
    "hsl(60, 100%, 70%)", // v3 - Yellow
    "hsl(0, 100%, 70%)", // v4 - Red
    "hsl(240, 100%, 70%)", // v5 - Blue
    "hsl(300, 100%, 70%)", // v6 - Purple
    "hsl(30, 100%, 70%)", // v7 - Orange
    "hsl(150, 100%, 70%)", // v8 - Turquoise
  ]);
  return majorVersion ? colorScale(majorVersion) : "rgba(255, 255, 255, 0.7)";
}
