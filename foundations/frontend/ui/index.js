import { useMemo, useState, Suspense } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";

// Main component to render the neural network
export default function ProductPreview() {
  const currentModel = useScreenStore((state) => state.currentArchitectures);

  return <>{currentModel?.[0] && <UI model={currentModel[0]} />}</>;
}

function UI({ model }) {
  const zoomFactor = useScreenStore((state) => state.zoomFactor);
  const setZoomFactor = useScreenStore((state) => state.setZoomFactor);

  const handleZoom = (direction) => {
    // Non-linear zoom factor calculation
    const zoomStep = zoomFactor * 0.2; // 20% of current zoom
    const newZoom =
      direction === "in" ? zoomFactor + zoomStep : zoomFactor - zoomStep;

    // Clamp the zoom value between 0.1 and 3
    const clampedZoom = Math.min(Math.max(newZoom, 0.1), 3);
    setZoomFactor(clampedZoom);
  };

  return (
    <S.UIWrapper>
      <S.TopLeft>State of the Art Gallery</S.TopLeft>

      <S.ZoomControls>
        <S.ZoomButton onClick={() => handleZoom("out")}>−</S.ZoomButton>
        <S.ZoomValue>{(zoomFactor * 100).toFixed(0)}%</S.ZoomValue>
        <S.ZoomButton onClick={() => handleZoom("in")}>+</S.ZoomButton>
      </S.ZoomControls>

      <S.BottomLeft>
        <S.Title>{model.name}</S.Title>
        <S.TitleRight>
          <S.TRBottom>{`${model.version}`}</S.TRBottom>
        </S.TitleRight>
      </S.BottomLeft>

      <S.BottomRight>
        <S.Row>{model.year}</S.Row>
        <S.Row>{model.place}</S.Row>
        <S.Row>
          <p>{model.explanation}</p>
        </S.Row>
      </S.BottomRight>
    </S.UIWrapper>
  );
}
