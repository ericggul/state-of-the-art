import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
  Suspense,
} from "react";
import useScreenStore from "@/components/screen/store";
import { useModelStructure } from "@/components/frontend/utils";
import TypewriterLayerText from "./TypewriterLayerText";
import * as S from "./styles";

import FrameSimple from "@/foundations/pc/frame/simple";
import Architecture3D from "@/foundations/frontend/3d";

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
  } = useModelStructure(currentArchitectures, 150);
  const containerRef = useRef(null);
  const scrollPosRef = useRef(0);
  const rafRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  // Check if scrolling is needed
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    setNeedsScroll(container.scrollHeight > container.clientHeight);
  }, [structure]);

  // Auto-scrolling effect
  useEffect(() => {
    if (!containerRef.current || !needsScroll) return;
    const container = containerRef.current;
    const scrollSpeed = 1;
    let lastTimestamp = 0;

    const scroll = (timestamp) => {
      if (!container) return;

      const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16.67 : 1;
      lastTimestamp = timestamp;

      const maxScroll = container.scrollHeight - container.clientHeight;
      scrollPosRef.current += scrollSpeed * deltaTime;

      if (scrollPosRef.current >= maxScroll) {
        scrollPosRef.current = 0;
      }

      container.scrollTop = Math.round(scrollPosRef.current);
      rafRef.current = requestAnimationFrame(scroll);
    };

    scrollPosRef.current = 0;
    container.scrollTop = 0;
    rafRef.current = requestAnimationFrame(scroll);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      scrollPosRef.current = 0;
      container.scrollTop = 0;
    };
  }, [structure, needsScroll]);

  return (
    <S.Container>
      <S.Canvas>
        <Suspense fallback={null}>
          <Architecture3D />
        </Suspense>
      </S.Canvas>

      <S.StructureText ref={containerRef} $needsScroll={needsScroll}>
        <div className={`model-structure${needsScroll ? " scrolling" : ""}`}>
          {structure.map((layer, idx) => (
            <LayerText
              key={`${layer.name}-${idx}-${currentArchitectures}`}
              layer={layer}
              showGrid={true}
              startDelay={idx * 600 + 50}
            />
          ))}
        </div>
      </S.StructureText>
      <FrameSimple />
    </S.Container>
  );
}
