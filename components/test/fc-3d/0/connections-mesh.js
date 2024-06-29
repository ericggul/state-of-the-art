import React, { useMemo } from "react";
import * as THREE from "three";

// Connections component
export default function Connections({ layerFrom, layerTo }) {
  const connections = useMemo(() => {
    const temp = [];

    for (let fromI = 0; fromI < layerFrom.grid.xCount; fromI++) {
      for (let fromJ = 0; fromJ < layerFrom.grid.yCount; fromJ++) {
        const fromXPos = layerFrom.grid.xInterval * fromI - ((layerFrom.grid.xCount - 1) * layerFrom.grid.xInterval) / 2 + layerFrom.position[0];
        const fromYPos = layerFrom.grid.yInterval * fromJ - ((layerFrom.grid.yCount - 1) * layerFrom.grid.yInterval) / 2 + layerFrom.position[1];

        for (let toI = 0; toI < layerTo.grid.xCount; toI++) {
          for (let toJ = 0; toJ < layerTo.grid.yCount; toJ++) {
            const toXPos = layerTo.grid.xInterval * toI - ((layerTo.grid.xCount - 1) * layerTo.grid.xInterval) / 2 + layerTo.position[0];
            const toYPos = layerTo.grid.yInterval * toJ - ((layerTo.grid.yCount - 1) * layerTo.grid.yInterval) / 2 + layerTo.position[1];

            temp.push({
              from: [fromXPos, fromYPos, layerFrom.position[2]],
              to: [toXPos, toYPos, layerTo.position[2]],
            });
          }
        }
      }
    }

    return temp;
  }, [layerFrom, layerTo]);

  return (
    <>
      {connections.map((connection, i) => (
        <SingleLine key={i} from={connection.from} to={connection.to} />
      ))}
    </>
  );
}

// Memoized SingleLine component with cylinder mesh geometry
const SingleLine = React.memo(({ from, to }) => {
  const start = new THREE.Vector3().fromArray(from);
  const end = new THREE.Vector3().fromArray(to);

  // Compute direction vector and length
  const direction = new THREE.Vector3().copy(end).sub(start);
  const length = direction.length();

  // Compute midpoint for positioning
  const midpoint = new THREE.Vector3().copy(start).add(end).multiplyScalar(0.5);

  // Compute rotation quaternion
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

  // Create cylinder geometry
  const geometry = useMemo(() => {
    const cylinderGeometry = new THREE.CylinderGeometry(0.005, 0.005, length, 8); // Adjust radius (0.005) as needed
    cylinderGeometry.translate(0, length / 2, 0); // Move center to middle
    return cylinderGeometry;
  }, [length]);

  return (
    <mesh geometry={geometry} position={[midpoint.x, midpoint.y, midpoint.z - 5]} quaternion={quaternion}>
      <meshBasicMaterial color="blue" />
    </mesh>
  );
});
