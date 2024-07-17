import * as S from "./styles";
import { useMemo, useEffect, useState, useRef } from "react";
import useResize from "@/utils/hooks/useResize";
import * as d3 from "d3";
import forceBoundary from "d3-force-boundary";

const DURATION = 300;

export default function Layer1({ newEmbeddings }) {
  const svgRef = useRef();
  const [windowWidth, windowHeight] = useResize();
  const [currentTarget, setCurrentTarget] = useState(null);

  // d3-related refs
  const simulationRef = useRef(null);
  const linkRef = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    const types = ["isCycle", "isNotCycle"];
    const color = d3.scaleOrdinal(types, ["hsl(180, 100%, 70%)", "hsl(0, 100%, 70%)"]);
    const width = windowWidth;
    const height = windowHeight;
    const svg = d3.select(svgRef.current);

    // Cleanup
    svg.selectAll("*").remove();

    // Marker default styling
    svg
      .append("defs")
      .selectAll("marker")
      .data(types)
      .join("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

    const nodes = Object.keys(newEmbeddings.embeddings).map((key, index) => ({
      id: index,
      text: key,
      ...newEmbeddings.embeddings[key],
    }));

    const links = []; // Add logic to create links if needed

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.text)
      )
      .force("charge", d3.forceManyBody().strength(-60 * ((width + height) / 1500) ** 2))
      .force("center", d3.forceCenter())
      .force("boundary", forceBoundary(-width * 0.6, -height * 0.45, width * 0.6, height * 0.45))
      .on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });

    const link = svg
      .append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("id", (d) => `link-${d.source.id}-${d.target.id}`)
      .attr("class", (d) => `link-source-${d.source.id} link-target-${d.target.id}`)
      .attr("stroke", (d) => (d.isCycle ? "hsl(180, 100%, 70%)" : "hsl(180, 100%, 70%)"))
      .attr("stroke-width", (d) => (d.isCycle ? 0.4 : 0.4) * width * 0.0024)
      .attr("opacity", "0.27");

    const node = svg
      .append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    node
      .append("circle")
      .attr("id", (d) => `circle-${d.id}`)
      .attr("r", width * 0.001)
      .attr("fill", "rgba(255, 255, 255, 0.7)");

    node
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

    simulationRef.current = simulation;
    linkRef.current = link;
    nodeRef.current = node;

    node.on("click", (event, d) => {
      setCurrentTarget(d.text);
    });

    node.on("mouseenter", (event, d) => {
      setCurrentTarget(d.text);
    });

    function linkArc(d) {
      const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
      return `M${d.source.x},${d.source.y}A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`;
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup function
    return () => {
      svg.selectAll("*").remove();
    };
  }, [newEmbeddings, windowWidth, windowHeight]);

  useEffect(() => {
    let node = nodeRef.current;
    let link = linkRef.current;

    //link and main node clean up
    link
      .transition()
      .duration(DURATION)
      .ease(d3.easeCubic)
      .attr("stroke", (d) => (d.isCycle ? "hsl(180, 100%, 70%)" : "hsl(180, 100%, 70%)"))
      .attr("opacity", (d) => (d.isCycle ? 1 : 0.2));
    node.selectAll("circle").transition().duration(DURATION).ease(d3.easeCubic).attr("fill", "rgba(255, 255, 255, 0.3)");
    node.selectAll("text").transition().duration(DURATION).ease(d3.easeCubic).attr("font-size", "1.2vw").attr("fill", "rgba(255, 255, 255, 0.05)");

    if (node && link) {
      const nodes = node.filter((d) => d.text === currentTarget);
      nodes.each((d) => {
        let circle = d3.select(`#circle-${d.id}`);
        let text = node.filter((n) => n.text === d.text).selectAll("text");

        circle.transition().duration(DURATION).ease(d3.easeCubic).attr("fill", "hsl(180, 100%, 93%)");
        text.transition().duration(DURATION).ease(d3.easeCubic).attr("x", "1vw").attr("y", ".4vw").attr("font-size", "10vw").attr("fill", "white");
      });
    }
  }, [currentTarget]);

  return (
    <S.Container>
      <svg ref={svgRef} />
    </S.Container>
  );
}
