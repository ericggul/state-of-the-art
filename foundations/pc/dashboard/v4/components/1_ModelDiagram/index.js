import React from "react";
import { DEFAULT_MODEL } from "../../utils/constants";
import * as S from "./styles";

export default function ModelDiagram({ model, hue }) {
  const architecture = model?.architecture || DEFAULT_MODEL.architecture || [];
  const modelKey = model?.name || "default";

  return (
    <S.Container>
      {architecture.map((layer, index) => (
        <React.Fragment key={`${modelKey}-${layer}-${index}`}>
          <S.Layer $hue={hue} $index={index}>
            {layer.toUpperCase()}
          </S.Layer>
          {index < architecture.length - 1 && (
            <S.Arrow $hue={hue} $index={index} />
          )}
        </React.Fragment>
      ))}
    </S.Container>
  );
}
