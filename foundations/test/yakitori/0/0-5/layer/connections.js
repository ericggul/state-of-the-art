import React, { useMemo } from "react";
import * as THREE from "three";

export default function Connections({ layersExpanded, structure }) {
  const connections = useMemo(() => {
    const tempConnections = [];

    layersExpanded.slice(0, -1).forEach((expanded, i) => {
      const nextExpanded = layersExpanded[i + 1];
      const layerFrom = structure[i];
      const layerTo = structure[i + 1];

      const fromXCount = expanded ? layerFrom.grid.xCount : 1;
      const fromYCount = expanded ? layerFrom.grid.yCount : 1;
      const fromXInterval = expanded ? layerFrom.grid.xInterval : 0;
      const fromYInterval = expanded ? layerFrom.grid.yInterval : 0;

      const toXCount = nextExpanded ? layerTo.grid.xCount : 1;
      const toYCount = nextExpanded ? layerTo.grid.yCount : 1;
      const toXInterval = nextExpanded ? layerTo.grid.xInterval : 0;
      const toYInterval = nextExpanded ? layerTo.grid.yInterval : 0;

      for (let fromI = 0; fromI < fromXCount; fromI++) {
        for (let fromJ = 0; fromJ < fromYCount; fromJ++) {
          const fromXPos = fromXInterval * fromI - ((fromXCount - 1) * fromXInterval) / 2 + layerFrom.position[0];
          const fromYPos = fromYInterval * fromJ - ((fromYCount - 1) * fromYInterval) / 2 + layerFrom.position[1];

          for (let toI = 0; toI < toXCount; toI++) {
            for (let toJ = 0; toJ < toYCount; toJ++) {
              const toXPos = toXInterval * toI - ((toXCount - 1) * toXInterval) / 2 + layerTo.position[0];
              const toYPos = toYInterval * toJ - ((toYCount - 1) * toYInterval) / 2 + layerTo.position[1];

              if (Math.random() < 0.5) {
                tempConnections.push({
                  from: new THREE.Vector3(fromXPos, fromYPos, layerFrom.position[2]),
                  to: new THREE.Vector3(toXPos, toYPos, layerTo.position[2]),
                });
              }
            }
          }
        }
      }
    });

    return tempConnections;
  }, [layersExpanded, structure]);

  return (
    <>
      {connections.map((connection, i) => (
        <SingleLine key={i} from={connection.from} to={connection.to} />
      ))}
    </>
  );
}

const SingleLine = React.memo(({ from, to }) => {
  const geometry = useMemo(() => {
    // Create a middle point that's offset in the Z direction to create a curve
    const midPoint = new THREE.Vector3().lerpVectors(from, to, 0.5);
    midPoint.z += 10; // Adjust this value to control the amount of curvature

    // Create a curve passing through the 'from', 'midPoint', and 'to'
    const curve = new THREE.CatmullRomCurve3([from, midPoint, to]);

    // Generate points along the curve
    const points = curve.getPoints(50); // Increase the number of points for a smoother curve

    // Create a geometry from these points
    const bufferGeometry = new THREE.BufferGeometry().setFromPoints(points);
    return bufferGeometry;
  }, [from, to]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="blue" transparent opacity={1} linewidth={1} linecap="round" linejoin="round" />
    </line>
  );
});
