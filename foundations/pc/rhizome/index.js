import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import * as S from "./styles";
import { DATA_NODES_LINKS } from "@/components/controller/constant/models/rhizome";
import forceBoundary from "d3-force-boundary";
import useScreenStore from "@/components/screen/store";

const DURATION = 300;

export default function Rhizome() {
  const { currentArchitectures } = useScreenStore();
  console.log(currentArchitectures);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentTarget, setCurrentTarget] = useState(null);
  const simulationRef = useRef(null);
  const nodesRef = useRef(null);
  const linksRef = useRef(null);

  // Transform data once, not on every render
  const data = useMemo(
    () => ({
      nodes: DATA_NODES_LINKS.nodes.map((node) => ({
        ...node,
        id: node.name,
        text: node.name,
      })),
      links: DATA_NODES_LINKS.links.map((link) => ({
        source: DATA_NODES_LINKS.nodes[link.source - 1].name,
        target: DATA_NODES_LINKS.nodes[link.target - 1].name,
        value: link.value,
        isCycle: false,
      })),
    }),
    []
  );

  // Initial setup of the graph
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up SVG with larger viewBox
    svg.attr("viewBox", [
      -dimensions.width * 0.4,
      -dimensions.height * 0.4,
      dimensions.width * 0.8,
      dimensions.height * 0.8,
    ]);

    // Create simulation with stronger forces and continuous motion
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.text)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter())
      .force("collision", d3.forceCollide().radius(50))
      // Add a small continuous force to keep the graph moving
      .velocityDecay(0.4)
      .alphaMin(0.001)
      .alphaDecay(0.001);

    // Create links
    const links = svg
      .append("g")
      .selectAll("path")
      .data(data.links)
      .join("path")
      .attr("stroke", "hsl(180, 100%, 70%)")
      .attr("stroke-width", 1) // Fixed thin width
      .attr("opacity", 0.27)
      .attr("fill", "none");

    // Create nodes group
    const nodes = svg
      .append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation));

    // Add circles to nodes
    nodes
      .append("circle")
      .attr("r", 5)
      .attr("id", (d) => `circle-${d.id}`)
      .attr("fill", "rgba(255, 255, 255, 0.7)");

    // Add text labels to nodes
    nodes
      .append("text")
      .text((d) => d.text)
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
  }, [dimensions, data]);

  // Handle currentArchitectures changes
  useEffect(() => {
    if (
      !simulationRef.current ||
      !nodesRef.current ||
      !currentArchitectures?.length
    )
      return;

    const currentNode = currentArchitectures[0].name;
    const simulation = simulationRef.current;

    // Reset all nodes to default style
    nodesRef.current
      .selectAll("circle")
      .transition()
      .duration(DURATION)
      .attr("fill", "rgba(255, 255, 255, 0.7)");

    nodesRef.current
      .selectAll("text")
      .transition()
      .duration(DURATION)
      .attr("font-size", "1.2vw")
      .attr("fill", "rgba(255, 255, 255, 0.5)");

    // Find and highlight the current node
    const nodeToHighlight = nodesRef.current.filter(
      (d) => d.text === currentNode
    );

    if (!nodeToHighlight.empty()) {
      const d = nodeToHighlight.datum();

      // Create a gentle centering force
      const centeringForce = d3.forceX(0).strength(0.1).initialize(data.nodes);

      const centeringForceY = d3.forceY(0).strength(0.1).initialize(data.nodes);

      // Apply the centering force only to the target node
      simulation.force("centerX", (alpha) => {
        const k = alpha * 0.1;
        data.nodes.forEach((node) => {
          if (node === d) {
            node.vx -= node.x * k;
            node.vy -= node.y * k;
          }
        });
      });

      // Highlight with smooth transition
      nodeToHighlight
        .select("circle")
        .transition()
        .duration(DURATION)
        .attr("fill", "hsl(180, 100%, 93%)");

      nodeToHighlight
        .select("text")
        .transition()
        .duration(DURATION)
        .attr("font-size", "3vw")
        .attr("fill", "white");

      // Gently restart simulation
      simulation
        .alpha(0.3)
        .alphaTarget(0.1) // Keep some continuous motion
        .restart();
    }
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
