import * as d3 from "d3";

export const linkArc = (d) => {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `M${d.source.x},${d.source.y} A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`;
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

export const updateNodeHighlight = (d, nodes) => {
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
};
