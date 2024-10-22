import React, { useMemo } from "react";
import * as THREE from "three";

function GANConnections({ generatorLayers, discriminatorLayers, style }) {
  const connections = useMemo(() => {
    const temp = [];

    // Connect the output of the generator to the input of the discriminator
    if (generatorLayers.length > 0 && discriminatorLayers.length > 0) {
      const generatorOutputLayer = generatorLayers[generatorLayers.length - 1];
      const discriminatorInputLayer = discriminatorLayers[0];

      // Adjust positions if necessary
      const fromPosition = [
        generatorOutputLayer.position[0],
        generatorOutputLayer.position[1] - 10, // Adjust if needed
        generatorOutputLayer.position[2],
      ];

      const toPosition = [
        discriminatorInputLayer.position[0],
        discriminatorInputLayer.position[1] + 10, // Adjust if needed
        discriminatorInputLayer.position[2],
      ];

      temp.push({ from: fromPosition, to: toPosition });
    }

    return temp;
  }, [generatorLayers, discriminatorLayers]);

  return (
    <>
      {connections.map((connection, i) => (
        <SingleLine
          key={i}
          from={connection.from}
          to={connection.to}
          style={style}
        />
      ))}
    </>
  );
}

function SingleLine({ from, to, style }) {
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [from, to]);

  const lineMaterialProps = {
    color: style?.colors?.connection || style?.colors?.inner || "blue",
    transparent: true,
    opacity: style?.material?.opacity || 1,
    linewidth: style?.connection?.linewidth || 1,
  };

  return (
    <line geometry={geometry}>
      <lineBasicMaterial attach="material" {...lineMaterialProps} />
    </line>
  );
}

export default GANConnections;
