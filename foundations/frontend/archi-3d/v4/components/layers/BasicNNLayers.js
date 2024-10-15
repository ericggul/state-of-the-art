import React, { useMemo, useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function BasicNNLayers({ structure, style, model }) {
  const localStructure = useMemo(
    () => generateStructure(structure.length),
    [structure.length]
  );
  const propInterval = useMemo(() => getRandom(200, 1000), []);

  const [expandedLayerIdx, setExpandedLayerIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setExpandedLayerIdx((i) => (i + 1) % structure.length);
    }, propInterval);
    return () => clearInterval(interval);
  }, [propInterval, structure.length]);

  const [layersExpanded, setLayersExpanded] = useState(() =>
    new Array(structure.length).fill(false)
  );

  useEffect(() => {
    setLayersExpanded((prev) =>
      prev.map((_, i) => Math.abs(i - expandedLayerIdx) < 2)
    );
  }, [expandedLayerIdx]);

  return (
    <group>
      {localStructure.map((structureEl, i) => (
        <Layer
          key={i}
          {...structureEl}
          expanded={layersExpanded[i]}
          setExpanded={() => {}}
        />
      ))}
      <Connections layersExpanded={layersExpanded} structure={localStructure} />
    </group>
  );
}

const Layer = (props) => {
  const { expanded, setExpanded } = props;

  function handleClick(e) {
    e.stopPropagation();
    setExpanded();
  }

  const [smoothedExpanded, setSmoothedExpanded] = useState(0);

  useSpring({
    from: { smoothedExpanded: 0 },
    to: { smoothedExpanded: expanded ? 1 : 0 },
    config: { mass: 1, tension: 120, friction: 13 },
    onChange: (value) => {
      setSmoothedExpanded(value.value.smoothedExpanded);
    },
  });

  return (
    <group position={props.position} onClick={handleClick}>
      {smoothedExpanded > 0 &&
        new Array(props.grid.xCount).fill(0).map((_, i) => (
          <animated.group
            key={i}
            position={[
              (props.grid.xInterval * i -
                ((props.grid.xCount - 1) * props.grid.xInterval) / 2) *
                smoothedExpanded,
              0,
              0,
            ]}
          >
            {new Array(props.grid.yCount).fill(0).map((_, j) => (
              <animated.group
                key={j}
                position={[
                  0,
                  (props.grid.yInterval * j -
                    ((props.grid.yCount - 1) * props.grid.yInterval) / 2) *
                    smoothedExpanded,
                  0,
                ]}
              >
                <Node
                  {...props.node}
                  color={props.color}
                  key={j}
                  opacity={smoothedExpanded}
                />
              </animated.group>
            ))}
          </animated.group>
        ))}

      {smoothedExpanded < 1 && (
        <Node
          {...props.unexpandedNode}
          color={props.color}
          position={[0, 0, 0]}
          scale={[
            1 - smoothedExpanded,
            1 - smoothedExpanded,
            1 - smoothedExpanded,
          ]}
        />
      )}
    </group>
  );
};

const Node = ({ position, size, color, opacity = 0.4, scale }) => {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[...size]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.9}
        opacity={opacity}
        transparent={true}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

function Connections({ layersExpanded, structure }) {
  const connectionsExpanded = useMemo(() => {
    return layersExpanded.slice(0, -1).map((layer, i) => ({
      from: layer,
      to: layersExpanded[i + 1],
    }));
  }, [layersExpanded]);

  return (
    <>
      {structure.slice(0, -1).map((_, i) => (
        <SingleConnection
          key={i}
          layerFrom={structure[i]}
          layerTo={structure[i + 1]}
          expanded={connectionsExpanded[i]}
        />
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
        const fromXPos =
          fromXInterval * fromI -
          ((fromXCount - 1) * fromXInterval) / 2 +
          layerFrom.position[0];
        const fromYPos =
          fromYInterval * fromJ -
          ((fromYCount - 1) * fromYInterval) / 2 +
          layerFrom.position[1];

        for (let toI = 0; toI < toXCount; toI++) {
          for (let toJ = 0; toJ < toYCount; toJ++) {
            const toXPos =
              toXInterval * toI -
              ((toXCount - 1) * toXInterval) / 2 +
              layerTo.position[0];
            const toYPos =
              toYInterval * toJ -
              ((toYCount - 1) * toYInterval) / 2 +
              layerTo.position[1];

            temp.push({
              from: [fromXPos, fromYPos, layerFrom.position[2]],
              to: [toXPos, toYPos, layerTo.position[2]],
            });
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
      <lineBasicMaterial
        color="blue"
        transparent
        opacity={1}
        linewidth={1}
        linecap="round"
        linejoin="round"
      />
    </line>
  );
});

function generateStructure(layerCount = 17) {
  const structure = [];
  const colorVariations = ["hsl(240, 100%, 50%)", "blue"];

  for (let i = 0; i < layerCount; i++) {
    const positionZ = 10 * (i - (layerCount - 1) / 2);
    const gridXCount = Math.floor(Math.random() * 3) + 2;
    const gridYCount = Math.floor(Math.random() * 3) + 2;
    const xInterval = getRandom(5, 5);
    const yInterval = getRandom(5, 5);

    structure.push({
      position: [0, 0, positionZ],
      node: {
        size: [4, 4, 0.3],
      },
      unexpandedNode: {
        size: [8, 8, 0.3],
      },
      grid: {
        xCount: gridXCount,
        yCount: gridYCount,
        xInterval: xInterval,
        yInterval: yInterval,
      },
      color: colorVariations[i % colorVariations.length],
    });
  }

  return structure;
}
