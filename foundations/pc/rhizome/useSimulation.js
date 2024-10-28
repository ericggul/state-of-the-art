import { useEffect, useRef } from "react";
import * as d3 from "d3";
import forceBoundary from "d3-force-boundary";
import { linkArc, drag } from "./d3utils";
import { getVersionColor } from "./constants";

export const useSimulation = (svgRef, dimensions, data) => {
  const simulationRef = useRef(null);
  const nodesRef = useRef(null);
  const linksRef = useRef(null);
  const boundaryRef = useRef({ width: 0, height: 0 });

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
      .force("charge", d3.forceManyBody().strength(-400))
      .force(
        "boundary",
        forceBoundary(
          -boundaryRef.current.width / 2,
          -boundaryRef.current.height / 1.5,
          boundaryRef.current.width / 2,
          boundaryRef.current.height / 1.5
        )
      )
      .alphaDecay(0.01)
      .velocityDecay(0.3);

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
      .attr("id", (d) => `circle-${d.id}`)
      .attr("fill", (d) => getVersionColor(d.majorVersion))
      .attr("opacity", 0.7)
      .attr("stroke", (d) =>
        d.majorVersion
          ? d3.color(getVersionColor(d.majorVersion)).darker(0.5)
          : "none"
      )
      .attr("stroke-width", 1);

    // Add labels to nodes
    nodes
      .append("text")
      .text((d) => d.text)
      .attr("x", 8)
      .attr("y", 3)
      .attr("font-size", "1.2vw")
      .attr("fill", "rgba(255, 255, 255, 0.5)");

    // Update positions on tick
    simulation.on("tick", () => {
      links.attr("d", linkArc);
      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Store refs
    simulationRef.current = simulation;
    nodesRef.current = nodes;
    linksRef.current = links;

    return () => {
      if (simulation) simulation.stop();
    };
  }, [dimensions, data]);

  return { simulationRef, nodesRef, linksRef, boundaryRef };
};
