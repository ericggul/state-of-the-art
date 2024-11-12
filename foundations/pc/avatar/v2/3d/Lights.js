export function Lights() {
  return (
    <>
      <ambientLight intensity={1} />
      <spotLight
        position={[-4, 4, -4]}
        angle={0.3}
        penumbra={1}
        intensity={0.4}
        color="#4facfe"
        castShadow
      />
      <spotLight
        position={[4, 4, -4]}
        angle={0.3}
        penumbra={1}
        intensity={0.4}
        color="#00f2fe"
        castShadow
      />
      <spotLight
        position={[0, 1, 2]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
        color="white"
      />
    </>
  );
}
