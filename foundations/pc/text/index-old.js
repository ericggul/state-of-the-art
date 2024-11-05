import React, { useEffect, useRef } from "react";
import useScreenStore from "@/components/screen/store";
import { useModelStructure } from "@/components/frontend/utils";
import * as S from "./styles";

const formatDimensions = (dims) => {
  if (!dims) return "";
  if (Array.isArray(dims)) return `[${dims.join(" × ")}]`;
  return `[${dims}]`;
};

const formatParams = (params) => {
  if (!params) return "";
  return Object.entries(params)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(", ");
};

const LayerText = ({ layer, depth = 0, showGrid = false }) => {
  const indent = "  ".repeat(depth);
  const dimensionText = formatDimensions(layer.dimensions);
  const paramsText = formatParams(layer.parameters);
  const gridText = showGrid && layer.type ? formatParams(layer.grid) : "";

  return (
    <>
      <div>
        {indent}
        {depth === 0 ? "└─" : "├─"} {layer.name}
        {dimensionText && <span className="dims">{dimensionText}</span>}
        {layer.type && <span className="type">{`<${layer.type}>`}</span>}
        {paramsText && <span className="params">{`(${paramsText})`}</span>}
        {gridText && <span className="grid">{`{${gridText}}`}</span>}
      </div>
      {layer.sublayers?.map((sublayer, idx) => (
        <LayerText
          key={`${sublayer.name}-${idx}`}
          layer={sublayer}
          depth={depth + 1}
          showGrid={showGrid}
        />
      ))}
    </>
  );
};

export default function TextComponent() {
  const { currentArchitectures } = useScreenStore();
  const { structure } = useModelStructure(currentArchitectures);
  const containerRef = useRef(null);

  // Auto-scrolling effect
  useEffect(() => {
    if (!containerRef.current) return;

    let scrollPos = 0;
    const scrollSpeed = 1; // Adjust speed as needed
    const maxScroll =
      containerRef.current.scrollHeight - containerRef.current.clientHeight;

    const scroll = () => {
      if (!containerRef.current) return;

      scrollPos += scrollSpeed;
      if (scrollPos >= maxScroll) {
        scrollPos = 0;
      }

      containerRef.current.scrollTop = scrollPos;
    };

    const intervalId = setInterval(scroll, 50);
    return () => clearInterval(intervalId);
  }, [structure]);

  return (
    <S.Container>
      <S.StructureText ref={containerRef}>
        <div className="model-structure">
          {structure.map((layer, idx) => (
            <LayerText
              key={`${layer.name}-${idx}`}
              layer={layer}
              showGrid={true}
            />
          ))}
        </div>
      </S.StructureText>
    </S.Container>
  );
}
