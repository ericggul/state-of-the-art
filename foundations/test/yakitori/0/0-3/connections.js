import React, { useMemo } from "react";
import * as THREE from "three";

// Connections component
export default function Connections({ layersExpanded, structure }) {
  const connectionsExpanded = useMemo(() => {
    return layersExpanded.slice(0, -1).map((layer, i) => ({
      from: layer,
      to: layersExpanded[i + 1],
    }));
  }, [layersExpanded]);

  return (
    <>
      {structure.slice(0, -1).map((_, i) => (
        <SingleConnection key={i} layerFrom={structure[i]} layerTo={structure[i + 1]} expanded={connectionsExpanded[i]} />
      ))}
    </>
  );
}

function SingleConnection({ layerFrom, layerTo, expanded }) {
  const connections = useMemo(() => {
    const temp = [];

    const fromXCount = expanded.from ? layerFrom.grid.xCount : 1;
    const fromYCount = expanded.from ? layerFrom.grid.yCount : 1;
    const fromXInterval = expanded.from ? layerFrom.grid.xInterval : 0;
    const fromYInterval = expanded.from ? layerFrom.grid.yInterval : 0;

    const toXCount = expanded.to ? layerTo.grid.xCount : 1;
    const toYCount = expanded.to ? layerTo.grid.yCount : 1;
    const toXInterval = expanded.to ? layerTo.grid.xInterval : 0;
    const toYInterval = expanded.to ? layerTo.grid.yInterval : 0;

    for (let fromI = 0; fromI < fromXCount; fromI++) {
      for (let fromJ = 0; fromJ < fromYCount; fromJ++) {
        const fromXPos = fromXInterval * fromI - ((fromXCount - 1) * fromXInterval) / 2 + layerFrom.position[0];
        const fromYPos = fromYInterval * fromJ - ((fromYCount - 1) * fromYInterval) / 2 + layerFrom.position[1];

        for (let toI = 0; toI < toXCount; toI++) {
          for (let toJ = 0; toJ < toYCount; toJ++) {
            const toXPos = toXInterval * toI - ((toXCount - 1) * toXInterval) / 2 + layerTo.position[0];
            const toYPos = toYInterval * toJ - ((toYCount - 1) * toYInterval) / 2 + layerTo.position[1];

            if (Math.random() < 0.5) {
              temp.push({
                from: [fromXPos, fromYPos, layerFrom.position[2]],
                to: [toXPos, toYPos, layerTo.position[2]],
              });
            }
          }
        }
      }
    }

    return temp;
  }, [layerFrom, layerTo, expanded]);

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
    const start = new THREE.Vector3().fromArray(from);
    const end = new THREE.Vector3().fromArray(to);
    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);

    const points = [start, mid, end];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="blue" transparent opacity={1} linewidth={1} linecap="round" linejoin="round" />
    </line>
  );
});
