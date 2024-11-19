import React from "react";
import { DEFAULT_MODEL } from "../../utils/constants";
import * as S from "./styles";

export default function ModelDiagram({ model }) {
  const architecture = model?.architecture || DEFAULT_MODEL.architecture || [];

  return (
    <S.Container>
      {architecture.map((layer, index) => (
        <React.Fragment key={layer}>
          <S.Layer>{layer.toUpperCase()}</S.Layer>
          {index < architecture.length - 1 && <S.Arrow />}
        </React.Fragment>
      ))}
    </S.Container>
  );
}
