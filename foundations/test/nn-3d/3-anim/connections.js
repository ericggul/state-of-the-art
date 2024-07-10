import { OrbitControls, Environment, Instances, Instance, Line } from "@react-three/drei";
import { useState, useMemo, Suspense } from "react";
import * as THREE from "three";

import { STRUCTURE, NODE_SCALE } from "./index";

// { dimensions: [27, 27, 96], zSpan: [12, 8], type: "pool" },
// { dimensions: [27, 27, 256], zSpan: [16, 16], type: "conv" },

// node={{
//   size: [dimensions[0] * NODE_SCALE, dimensions[1] * NODE_SCALE, 1],
//   wireframeDivision: 10,
// }}
// grid={{
//   xCount: zSpan[0],
//   yCount: zSpan[1],
//   xInterval: dimensions[0] * NODE_SCALE * 1.1,
//   yInterval: dimensions[1] * NODE_SCALE * 1.1,
// }}

// Component to render connections between layers
export default function Connections({ layerFrom, layerTo }) {
  const connections = useMemo(() => {
    const temp = [];

    // for (let i = 0; i < layerFrom.dimensions[2]; i++) {
    //   for (let j = 0; j < layerTo.dimensions[2]; j++) {
    //     const xCountFrom = layerFrom.zSpan[0];
    //     const yCountFrom = layerFrom.zSpan[1];
    //     const xIntervalFrom = layerFrom.dimensions[0] * NODE_SCALE * 1.1;
    //     const yIntervalFrom = layerFrom.dimensions[1] * NODE_SCALE * 1.1;

    //     const iFrom = i % xCountFrom;
    //     const jFrom = Math.floor(i / xCountFrom);

    //     const fromXPos = xIntervalFrom * iFrom - ((xCountFrom - 1) * xIntervalFrom) / 2;
    //     const fromYPos = yIntervalFrom * jFrom - ((yCountFrom - 1) * yIntervalFrom) / 2;

    //     const from = [fromXPos, fromYPos, 0];

    //     const xCountTo = layerTo.zSpan[0];
    //     const yCountTo = layerTo.zSpan[1];
    //     const xIntervalTo = layerTo.dimensions[0] * NODE_SCALE * 1.1;
    //     const yIntervalTo = layerTo.dimensions[1] * NODE_SCALE * 1.1;

    //     const iTo = j % xCountTo;
    //     const jTo = Math.floor(j / xCountTo);

    //     const toXPos = xIntervalTo * iTo - ((xCountTo - 1) * xIntervalTo) / 2;
    //     const toYPos = yIntervalTo * jTo - ((yCountTo - 1) * yIntervalTo) / 2;

    //     const to = [toXPos, toYPos, 10];

    //     temp.push({ from, to });
    //   }
    // }

    return temp;
  }, [layerFrom, layerTo]);

  return (
    <>
      {connections.map((connection, i) => (
        <Connection key={i} from={connection.from} to={connection.to} />
      ))}
    </>
  );
}

function Connection({ from, to }) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);

  const ref = useMemo(() => new THREE.BufferGeometry(), [start, end]);
  ref.setFromPoints([start, mid, end]);

  return (
    <line geometry={ref}>
      <lineBasicMaterial color={"white"} linewidth={2} linecap="round" linejoin="round" />
    </line>
  );
}
