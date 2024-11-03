import { useEffect, useRef } from "react";
import * as d3 from "d3";
import forceBoundary from "d3-force-boundary";
import { linkArc, drag } from "./utils";
import { getVersionColor } from "./constants";

export const useSimulation = (svgRef, dimensions, data) => {
  const simulationRef = useRef(null);
  const nodesRef = useRef(null);
  const linksRef = useRef(null);
  const boundaryRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current || !dimensions.width || !dimensions.height) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    boundaryRef.current = {
      width: dimensions.width * 0.9,
      height: dimensions.height * 0.95, // Increased from 0.9 to use more vertical space
    };

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${dimensions.width / 2}, ${dimensions.height / 2})`
      );

    // Performance-optimized simulation
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.name)
          .distance(20) // Increased from 60 to spread links more
      )
      .force("charge", d3.forceManyBody().strength(-300)) // Increased repulsion from -300
      .force(
        "boundary",
        forceBoundary(
          -boundaryRef.current.width / 2,
          -boundaryRef.current.height / 1.1, // Changed from 1.2 to 1.1 for more vertical space
          boundaryRef.current.width / 2,
          boundaryRef.current.height / 1.1 // Changed from 1.2 to 1.1 for more vertical space
        )
      )
      .alphaDecay(0.03)
      .velocityDecay(0.45);

    // Simplified, performance-focused links
    const links = g
      .append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(data.links)
      .join("path")
      .attr("stroke", (d) => {
        const sourceNode = data.nodes.find((n) => n.name === d.source.name);
        const targetNode = data.nodes.find((n) => n.name === d.target.name);
        return sourceNode.majorVersion === targetNode.majorVersion
          ? getVersionColor(sourceNode.majorVersion)
          : "hsla(180, 100%, 50%, 0.5)";
      })
      .attr("stroke-width", 1)
      .attr("opacity", 0.4)
      .attr("fill", "none");

    // Simplified, performance-focused nodes
    const nodes = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation));

    nodes
      .append("circle")
      .attr("r", 0.5)
      .attr("id", (d) => `circle-${d.id}`)
      .attr("fill", (d) => getVersionColor(d.majorVersion))
      .attr("opacity", 0.9)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5);

    // Simplified text
    nodes
      .append("text")
      .text((d) => d.text)
      .attr("x", 6)
      .attr("y", 4);

    // Optimized tick function
    simulation.on("tick", () => {
      links.attr("d", linkArc);
      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    simulationRef.current = simulation;
    nodesRef.current = nodes;
    linksRef.current = links;

    return () => simulation.stop();
  }, [dimensions, data]);

  return { simulationRef, nodesRef, linksRef, boundaryRef };
};
