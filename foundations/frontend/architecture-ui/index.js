import { useMemo, useState, Suspense } from "react";
import * as S from "./styles";

import { TEST_MODELS } from "./constant";

// Main component to render the neural network
export default function ProductPreview() {
  const [modelIdx, setModelIdx] = useState(1);

  return <UI data={TEST_MODELS[modelIdx]} />;
}

function UI({ data }) {
  return (
    <S.UIWrapper>
      <S.TopLeft>Neural Network Architcture</S.TopLeft>
      <S.BottomLeft>
        <S.Title>{data.name.header + " "}</S.Title>
        <S.TitleRight>
          <S.TRTop>{data.name.fullName || " "}</S.TRTop>
          <S.TRBottom>{`v${data.version}`}</S.TRBottom>
        </S.TitleRight>
      </S.BottomLeft>
      <S.BottomRight>
        <S.Row>{data.year}</S.Row>
        <S.Row>{data.createdFrom}</S.Row>
        <S.Row>
          {data.citation} <span>Citations</span>
        </S.Row>
        <S.Row>
          <p>{data.description}</p>
        </S.Row>
      </S.BottomRight>
    </S.UIWrapper>
  );
}
