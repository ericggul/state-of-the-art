import React from "react";

const Node = React.memo(({ size, style, color, isProjector }) => {
  return (
    <mesh castShadow={style.shadows} receiveShadow={style.shadows}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        {...style.material}
        color={color}
        emissive={style.emissive ? style.colors.emissive : "black"}
        emissiveIntensity={style.emissive ? 0.5 : 0}
        wireframe={!isProjector}
      />
    </mesh>
  );
});

export default Node;
