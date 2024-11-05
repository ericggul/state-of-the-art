import React from "react";
import useScreenStore from "@/components/screen/store";
import { useModelStructure } from "@/components/frontend/utils";
import * as S from "./styles";

const formatDimensions = (dims) => {
  if (!dims) return "";
  if (Array.isArray(dims)) return `[${dims.join(" × ")}]`;
  return `[${dims}]`;
};

const LayerText = ({ layer, depth = 0 }) => {
  const indent = "  ".repeat(depth);
  const dimensionText = formatDimensions(layer.dimensions);

  return (
    <>
      <div>
        {indent}└─ {layer.name} {dimensionText}
        {layer.type && <span className="type">{`<${layer.type}>`}</span>}
      </div>
      {layer.sublayers?.map((sublayer, idx) => (
        <LayerText
          key={`${sublayer.name}-${idx}`}
          layer={sublayer}
          depth={depth + 1}
        />
      ))}
    </>
  );
};

export default function TextComponent() {
  const { currentArchitectures } = useScreenStore();
  const { structure } = useModelStructure(currentArchitectures);

  return (
    <S.Container>
      <S.StructureText>
        <div className="model-structure">
          {structure.map((layer, idx) => (
            <LayerText key={`${layer.name}-${idx}`} layer={layer} />
          ))}
        </div>
      </S.StructureText>
    </S.Container>
  );
}
