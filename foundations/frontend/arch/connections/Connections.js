import React, { useMemo, memo } from "react";
import * as THREE from "three";

const SingleLine = memo(({ from, to, style }) => {
  const geometry = useMemo(() => {
    const start = new THREE.Vector3().fromArray(from);
    const end = new THREE.Vector3().fromArray(to);
    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
    return new THREE.BufferGeometry().setFromPoints([start, mid, end]);
  }, [from, to]);

  const lineMaterialProps = useMemo(
    () => ({
      color: style?.colors?.connection || style?.colors?.inner || "blue",
      transparent: true,
      opacity: style?.material?.opacity || 1,
      linewidth: style?.connection?.linewidth || 1,
      linecap: "round",
      linejoin: "round",
      emissive: style?.material?.emissive,
      emissiveIntensity: style?.material?.emissiveIntensity || 1,
    }),
    [style]
  );

  return (
    <line geometry={geometry}>
      <lineBasicMaterial {...lineMaterialProps} />
    </line>
  );
});

const SingleConnection = memo(({ layerFrom, layerTo, expanded, style }) => {
  const connections = useMemo(() => {
    if (!layerFrom || !layerTo || !expanded) return [];

    const fromXCount = expanded.from ? layerFrom.grid.xCount : 1;
    const fromYCount = expanded.from ? layerFrom.grid.yCount : 1;
    const fromXInterval = expanded.from ? layerFrom.grid.xInterval : 0;
    const fromYInterval = expanded.from ? layerFrom.grid.yInterval : 0;

    const toXCount = expanded.to ? layerTo.grid.xCount : 1;
    const toYCount = expanded.to ? layerTo.grid.yCount : 1;
    const toXInterval = expanded.to ? layerTo.grid.xInterval : 0;
    const toYInterval = expanded.to ? layerTo.grid.yInterval : 0;

    return Array.from(
      { length: fromXCount * fromYCount * toXCount * toYCount },
      (_, index) => {
        const fromI = Math.floor(index / (fromYCount * toXCount * toYCount));
        const fromJ = Math.floor(
          (index % (fromYCount * toXCount * toYCount)) / (toXCount * toYCount)
        );
        const toI = Math.floor((index % (toXCount * toYCount)) / toYCount);
        const toJ = index % toYCount;

        const fromXPos =
          fromXInterval * fromI -
          ((fromXCount - 1) * fromXInterval) / 2 +
          layerFrom.position[0];
        const fromYPos =
          fromYInterval * fromJ -
          ((fromYCount - 1) * fromYInterval) / 2 +
          layerFrom.position[1];
        const toXPos =
          toXInterval * toI -
          ((toXCount - 1) * toXInterval) / 2 +
          layerTo.position[0];
        const toYPos =
          toYInterval * toJ -
          ((toYCount - 1) * toYInterval) / 2 +
          layerTo.position[1];

        return {
          from: [fromXPos, fromYPos, layerFrom.position[2]],
          to: [toXPos, toYPos, layerTo.position[2]],
        };
      }
    );
  }, [layerFrom, layerTo, expanded]);

  return connections.map((connection, i) => (
    <SingleLine key={i} {...connection} style={style} />
  ));
});

const Connections = memo(({ layersExpanded, structure, style }) => {
  const connectionsExpanded = useMemo(() => {
    if (!layersExpanded?.length) {
      return structure.slice(0, -1).map(() => ({ from: false, to: false }));
    }
    return layersExpanded.slice(0, -1).map((layer, i) => ({
      from: layer,
      to: layersExpanded[i + 1],
    }));
  }, [layersExpanded, structure]);

  return structure
    .slice(0, -1)
    .map((_, i) => (
      <SingleConnection
        key={i}
        layerFrom={structure[i]}
        layerTo={structure[i + 1]}
        expanded={connectionsExpanded[i] || { from: false, to: false }}
        style={style}
      />
    ));
});

Connections.displayName = "Connections";
SingleConnection.displayName = "SingleConnection";
SingleLine.displayName = "SingleLine";

export default Connections;
