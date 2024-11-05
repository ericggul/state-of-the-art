import React, { useEffect, useRef, useCallback, useMemo } from "react";
import useScreenStore from "@/components/screen/store";
import { useModelStructure } from "@/components/frontend/utils";
import TypewriterLayerText from "./TypewriterLayerText";
import * as S from "./styles";

// Memoize LayerText component
const LayerText = React.memo(
  ({ layer, depth = 0, showGrid = false, startDelay = 0 }) => {
    // Move formatting functions inside the component
    const formatDimensions = useCallback((dims) => {
      if (!dims) return "";
      if (Array.isArray(dims)) return `[${dims.join(" × ")}]`;
      return `[${dims}]`;
    }, []);

    const formatParams = useCallback((params) => {
      if (!params) return "";
      return Object.entries(params)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ");
    }, []);

    const indent = "  ".repeat(depth);
    const branchChar = depth === 0 ? "└─" : "├─";
    const verticalLine = depth > 1 ? "│ ".repeat(depth - 1) : "";

    const dimensionText = useMemo(
      () => formatDimensions(layer.dimensions),
      [layer.dimensions, formatDimensions]
    );

    const paramsText = useMemo(
      () => formatParams(layer.parameters),
      [layer.parameters, formatParams]
    );

    const gridText = useMemo(
      () => (showGrid && layer.type ? formatParams(layer.grid) : ""),
      [showGrid, layer.type, layer.grid, formatParams]
    );

    const fullText = useMemo(
      () =>
        `${layer.name}${dimensionText}${layer.type ? ` <${layer.type}>` : ""}${
          paramsText ? ` (${paramsText})` : ""
        }${gridText ? ` {${gridText}}` : ""}`,
      [layer.name, dimensionText, layer.type, paramsText, gridText]
    );

    const baseDelay = depth * 200;

    return (
      <>
        <div className="tree-content">
          <span className="tree-line">
            {indent}
            {verticalLine}
            <span className="branch-char">{branchChar}</span>
          </span>{" "}
          <span className={`depth-${depth}`}>
            <TypewriterLayerText
              text={fullText}
              speed={20 + depth * 2}
              depth={depth}
              enableSound={depth < 3}
              startDelay={startDelay + baseDelay}
            />
          </span>
        </div>
        <div className="sublayers">
          {layer.sublayers?.map((sublayer, idx) => (
            <LayerText
              key={`${sublayer.name}-${idx}-${depth}`}
              layer={sublayer}
              depth={depth + 1}
              showGrid={showGrid}
              startDelay={startDelay + baseDelay + idx * 100}
            />
          ))}
        </div>
      </>
    );
  }
);

export default function TextComponent() {
  const { currentArchitectures } = useScreenStore();
  const {
    visualization: { structure },
  } = useModelStructure(currentArchitectures);
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
              startDelay={idx * 600}
            />
          ))}
        </div>
      </S.StructureText>
    </S.Container>
  );
}
