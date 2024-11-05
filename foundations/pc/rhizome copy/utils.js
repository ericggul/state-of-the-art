import * as d3 from "d3";
import { VISUAL } from "./constants";

export const linkArc = (d) => {
  const dx = d.target.x - d.source.x;
  const dy = d.target.y - d.source.y;
  const dr = Math.sqrt(dx * dx + dy * dy) * VISUAL.LINK.CURVE_FACTOR;
  return `M${d.source.x},${d.source.y} A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
};

export const drag = (simulation) => {
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
};

export const updateNodeHighlight = (d, nodes, links) => {
  // Find connected nodes
  const connectedNodes = new Set();
  links.each((link) => {
    if (link.source.id === d.id) connectedNodes.add(link.target.id);
    if (link.target.id === d.id) connectedNodes.add(link.source.id);
  });

  // Update main highlighted node
  const circle = d3.select(`#circle-${d.id}`);
  const text = nodes.filter((n) => n.text === d.text).selectAll("text");

  // Main node highlight (keep existing logic)
  circle
    .transition()
    .duration(400)
    .ease(d3.easeCubicOut)
    .attr("fill", "hsl(180, 100%, 93%)")
    .attr("r", VISUAL.NODE.HIGHLIGHTED.RADIUS)
    .attr("opacity", VISUAL.NODE.HIGHLIGHTED.OPACITY)
    .attr("stroke-width", VISUAL.NODE.HIGHLIGHTED.STROKE_WIDTH);

  text
    .transition()
    .duration(400)
    .ease(d3.easeCubicOut)
    .attr("x", -VISUAL.NODE.HIGHLIGHTED.RADIUS - 12)
    .attr("font-size", VISUAL.NODE.HIGHLIGHTED.FONT_SIZE)
    .attr("fill", "white");

  // Sub-highlight connected nodes
  nodes.each((node) => {
    if (connectedNodes.has(node.id)) {
      d3.select(`#circle-${node.id}`)
        .transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .attr("r", VISUAL.NODE.SUB_HIGHLIGHTED.RADIUS)
        .attr("opacity", VISUAL.NODE.SUB_HIGHLIGHTED.OPACITY)
        .attr("stroke-width", VISUAL.NODE.SUB_HIGHLIGHTED.STROKE_WIDTH);

      nodes
        .filter((n) => n.id === node.id)
        .selectAll("text")
        .transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .attr("x", -VISUAL.NODE.SUB_HIGHLIGHTED.RADIUS - 10)
        .attr("font-size", VISUAL.NODE.SUB_HIGHLIGHTED.FONT_SIZE)
        .attr("opacity", 0.8);
    }
  });

  // Highlight connected links
  links.each(function (link) {
    const isConnected = link.source.id === d.id || link.target.id === d.id;
    if (isConnected) {
      d3.select(this)
        .transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .attr("opacity", VISUAL.LINK.HIGHLIGHTED.OPACITY)
        .attr("stroke-width", VISUAL.LINK.HIGHLIGHTED.STROKE_WIDTH);
    }
  });
};
