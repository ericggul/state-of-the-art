//d3
import * as d3 from "d3";

export const DURATION_IN = 150;
export const DURATION_OUT = 300;

function updateHighlightNode({ d, node }) {
  let circle = d3.select(`#circle-${d.id}`);
  let text = node.filter((n) => n.text === d.text).selectAll("text");

  circle.transition().duration(DURATION_IN).attr("fill", "hsl(90, 100%, 93%)");
  text.transition().duration(DURATION_IN).attr("x", "1vw").attr("y", ".4vw").attr("font-size", "3vw").attr("fill", "hsl(180, 100%, 70%)");
}

function updateCurrentNode({ d, node }) {
  let circle = d3.select(`#circle-${d.id}`);
  let text = node.filter((n) => n.text === d.text).selectAll("text");

  circle.transition().duration(DURATION_IN).attr("fill", "hsl(180, 100%, 93%)");
  text.transition().duration(DURATION_IN).attr("x", "1vw").attr("y", ".4vw").attr("font-size", "10vw").attr("fill", "white");
}

function updateTargetAndSourceNodes({ data, d, node, link, targetNodesRef, sourceNodesRef }) {
  let linksDataStartingFromTarget = data.links.filter((l) => l.source === d.text).map((d) => d.target);
  let linksDataEndingAtSource = data.links.filter((l) => l.target === d.text).map((d) => d.source);

  let targetNodes = node.filter((n) => linksDataStartingFromTarget.includes(n.text));
  let sourceNodes = node.filter((n) => linksDataEndingAtSource.includes(n.text));

  //targetnodes & sourcenodes clean up
  if (targetNodesRef.current && sourceNodesRef.current) {
    targetNodesRef.current.selectAll("circle").transition().duration(DURATION_OUT).attr("fill", "rgba(255, 255, 255, 0.3)");
    targetNodesRef.current.selectAll("text").transition().duration(DURATION_OUT).attr("fill", "rgba(255, 255, 255, 0.07)");
    sourceNodesRef.current.selectAll("circle").transition().duration(DURATION_OUT).attr("fill", "rgba(255, 255, 255, 0.3)");
    sourceNodesRef.current.selectAll("text").transition().duration(DURATION_OUT).attr("fill", "rgba(255, 255, 255, 0.07)");
  }

  //new styling
  targetNodes.selectAll("circle").transition().duration(DURATION_IN).attr("fill", "hsl(180, 100%, 70%)");
  targetNodes.selectAll("text").transition().duration(DURATION_IN).attr("fill", "rgba(255, 255, 255, .5)");
  sourceNodes.selectAll("circle").transition().duration(DURATION_IN).attr("fill", "hsl(0, 100%, 70%)");
  sourceNodes.selectAll("text").transition().duration(DURATION_IN).attr("fill", "rgba(255, 255, 255, .5)");

  //update ref
  targetNodesRef.current = targetNodes;
  sourceNodesRef.current = sourceNodes;

  //related links
  let links = link.filter((l) => l.source.text === d.text || l.target.text === d.text);
  let sourceLinks = links.filter((l) => l.source.text === d.text);
  let targetLinks = links.filter((l) => l.target.text === d.text);

  targetLinks.transition().duration(DURATION_IN).attr("stroke", "hsl(0, 100%, 70%)").attr("opacity", 1);
  sourceLinks.transition().duration(DURATION_IN).attr("opacity", 1);
}

function updateKeywordChain({ d, keywordsChain, node, link, unitSize }) {
  if (keywordsChain.length > 0) {
    //other links
    keywordsChain.forEach((keyword, i) => {
      let scaleIndicator = Math.max(1 - 0.1 * (keywordsChain.length - 1 - i), i / keywordsChain.length) * 0.7;

      //links
      if (i !== keywordsChain.length - 1) {
        let connectedLink = link.filter((l) => l.source.text === keywordsChain[i] && l.target.text === keywordsChain[i + 1]);
        connectedLink
          .transition()
          .duration(DURATION_IN)
          .attr("stroke-width", Math.max(6 * unitSize * scaleIndicator, 1.4 * unitSize));
      }

      //texts
      let connectedNode = node.filter((n) => n.text == keywordsChain[i]);
      connectedNode.selectAll("circle").transition().duration(DURATION_IN).attr("fill", "hsl(180, 100%, 93%)");

      if (i >= keywordsChain.length - 2) {
        connectedNode
          .selectAll("text")
          .transition()
          .duration(DURATION_IN)
          .attr("font-size", `${3.7 * scaleIndicator}vw`)
          .attr("fill", `rgba(255, 255, 255, 0.7)`);
      } else {
        connectedNode.selectAll("text").transition().duration(DURATION_IN).attr("font-size", `1.5vw`).attr("fill", `rgba(255, 255, 255, 0.5)`);
      }
    });

    let connectedLink = link.filter((l) => l.source.text === keywordsChain[keywordsChain.length - 1] && l.target.text === d.text);
    connectedLink
      .transition()
      .duration(DURATION_IN)
      .attr("opacity", 1)
      .attr("stroke", "hsl(180, 100%, 93%)")
      .attr("stroke-width", Math.max(4 * unitSize, 2));
  }
}

//export
export { updateTargetAndSourceNodes, updateKeywordChain, updateCurrentNode, updateHighlightNode };
