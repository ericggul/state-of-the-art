import { useEffect, useRef } from "react";
import * as d3 from "d3";
import forceBoundary from "d3-force-boundary";
import { linkArc, drag } from "./utils";
import {
  FORCE,
  VISUAL,
  LAYOUT,
  getVersionColor,
  DURATION,
  KEY_HUE,
} from "./constants";

export const useSimulation = (svgRef, dimensions, data, hue) => {
  const simulationRef = useRef(null);
  const nodesRef = useRef(null);
  const linksRef = useRef(null);
  const boundaryRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current || !dimensions.width || !dimensions.height) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    boundaryRef.current = {
      width: dimensions.width * VISUAL.BOUNDARY.WIDTH_FACTOR,
      height: dimensions.height * VISUAL.BOUNDARY.HEIGHT_FACTOR,
    };

    data.nodes.forEach((node) => {
      if (typeof node.x === "undefined") {
        node.x =
          dimensions.width / 2 + (Math.random() - 0.5) * dimensions.width * 0.5;
        node.y =
          dimensions.height / 2 +
          (Math.random() - 0.5) * dimensions.height * 0.5;
      }
    });

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
          .distance(FORCE.LINK.DISTANCE)
          .strength(FORCE.LINK.STRENGTH)
      )
      .force("charge", d3.forceManyBody().strength(FORCE.CHARGE.STRENGTH))
      .force(
        "boundary",
        forceBoundary(
          -boundaryRef.current.width / 2,
          -boundaryRef.current.height / 1.1,
          boundaryRef.current.width / 2,
          boundaryRef.current.height / 1.1
        )
      )
      .alphaDecay(FORCE.ALPHA_DECAY)
      .velocityDecay(FORCE.VELOCITY_DECAY);

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
          ? d3
              .color(getVersionColor(sourceNode.majorVersion, hue))
              .brighter(0.2)
          : `hsla(${hue}, 100%, 50%, 0.4)`;
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
      .attr("r", VISUAL.NODE.DEFAULT.RADIUS)
      .attr("id", (d) => `circle-${d.id}`)
      .attr("fill", (d) => getVersionColor(d.majorVersion, hue))
      .attr("opacity", VISUAL.NODE.DEFAULT.OPACITY)
      .attr("stroke", "#fff")
      .attr("stroke-width", VISUAL.NODE.DEFAULT.STROKE_WIDTH)
      .call(drag(simulation));

    // Simplified text
    nodes
      .append("text")
      .text((d) => d.text)
      .attr("x", (d) => VISUAL.NODE.DEFAULT.RADIUS + 6)
      .attr("y", (d) => VISUAL.NODE.DEFAULT.RADIUS / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("text-shadow", "0 0 3px rgba(0,0,0,0.5)")
      .attr("fill", `hsla(${hue}, 15%, 95%, ${VISUAL.TEXT.OPACITY})`)
      .attr("opacity", 0.8);

    // Optimized tick function
    simulation.on("tick", () => {
      links.attr("d", (d) => {
        if (
          isNaN(d.source.x) ||
          isNaN(d.source.y) ||
          isNaN(d.target.x) ||
          isNaN(d.target.y)
        ) {
          return null;
        }
        return linkArc(d);
      });

      nodes.attr("transform", (d) => {
        if (isNaN(d.x) || isNaN(d.y)) {
          return null;
        }
        return `translate(${d.x},${d.y})`;
      });
    });

    simulationRef.current = simulation;
    nodesRef.current = nodes;
    linksRef.current = links;

    return () => simulation.stop();
  }, [dimensions, data, hue]);

  return { simulationRef, nodesRef, linksRef, boundaryRef };
};
