import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as S from "./styles";
import { DATA_NODES_LINKS } from "@/components/controller/constant/models/rhizome";
import forceBoundary from "d3-force-boundary";

const DURATION = 300;

export default function Rhizome() {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [currentTarget, setCurrentTarget] = useState(null);
  const nodeRef = useRef(null);
  const linkRef = useRef(null);
  const simulationRef = useRef(null);

  // Transform data to match d3's expected format
  const data = {
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
  };

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

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    // Clear previous visualization
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up SVG
    svg.attr("viewBox", [
      -dimensions.width / 2,
      -dimensions.height / 2,
      dimensions.width,
      dimensions.height,
    ]);

    // Create simulation with stronger forces and boundary
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3.forceLink(data.links).id((d) => d.text)
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-60 * ((dimensions.width + dimensions.height) / 1500) ** 2)
      )
      .force("center", d3.forceCenter())
      .force(
        "boundary",
        forceBoundary(
          -dimensions.width * 0.6,
          -dimensions.height * 0.45,
          dimensions.width * 0.6,
          dimensions.height * 0.45
        )
      );

    // Create links with curved paths
    const links = svg
      .append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(data.links)
      .join("path")
      .attr("stroke", "hsl(180, 100%, 70%)")
      .attr("stroke-width", (d) => d.value * dimensions.width * 0.0008)
      .attr("opacity", 0.27);

    // Create nodes with enhanced styling
    const nodes = svg
      .append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation));

    // Add circles to nodes
    nodes
      .append("circle")
      .attr("id", (d) => `circle-${d.id}`)
      .attr("r", dimensions.width * 0.001)
      .attr("fill", "rgba(255, 255, 255, 0.7)");

    // Add labels to nodes with better typography
    nodes
      .append("text")
      .attr("id", (d) => `text-${d.id}`)
      .attr("x", ".7vw")
      .attr("y", ".3vw")
      .attr("font-size", "1.2vw")
      .attr("font-family", "Bebas Neue")
      .attr("fill", "rgba(255, 255, 255, 0.05)")
      .text((d) => d.text)
      .clone(true)
      .lower();

    // Store refs for later use
    nodeRef.current = nodes;
    linkRef.current = links;
    simulationRef.current = simulation;

    // Update positions on tick with curved links
    simulation.on("tick", () => {
      links.attr("d", linkArc);
      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Handle node interactions
    nodes
      .on("click", (event, d) => {
        setCurrentTarget(d.text);
        updateNodeHighlight(d, nodes);
      })
      .on("mouseover", (event, d) => {
        d3.select(`#circle-${d.id}`)
          .transition()
          .duration(150)
          .attr("fill", "hsl(90, 100%, 93%)");

        d3.select(`#text-${d.id}`)
          .transition()
          .duration(150)
          .attr("font-size", "3vw")
          .attr("fill", "hsl(180, 100%, 70%)");
      })
      .on("mouseout", (event, d) => {
        if (d.text !== currentTarget) {
          d3.select(`#circle-${d.id}`)
            .transition()
            .duration(300)
            .attr("fill", "rgba(255, 255, 255, 0.7)");

          d3.select(`#text-${d.id}`)
            .transition()
            .duration(300)
            .attr("font-size", "1.2vw")
            .attr("fill", "rgba(255, 255, 255, 0.05)");
        }
      });
  }, [dimensions, data, currentTarget]);

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
