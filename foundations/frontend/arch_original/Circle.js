import React from "react";
import Node from "./Node";

function Circle({ nodeCount, radius, style, layer, nodeSize = [1, 1, 1] }) {
  const angleStep = (2 * Math.PI) / nodeCount;
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const angle = i * angleStep;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    nodes.push(
      <group position={[x, 0, z]} key={`${layer.name}-node-${i}`}>
        <Node size={nodeSize} style={style} color={style.colors.inner} />
      </group>
    );
  }

  return <group rotation={[0, 0, 0]}>{nodes}</group>;
}

export default Circle;
