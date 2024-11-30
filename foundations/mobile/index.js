import React, { useMemo } from "react";
import * as S from "./styles";
import { MODELS } from "@/components/controller/constant/models";
import { flattenModels, filterModels } from "@/components/frontend/utils";
import useFeedback from "./utils/useFeedback";
import { useModelListLogic } from "./utils/modelListLogic/useLogic";

export default function Mobile({ socket, mobileId }) {
  const modelsArray = useMemo(() => filterModels(flattenModels(MODELS)), []);

  return (
    <S.Container>
      <ModelList
        initialModels={modelsArray}
        socket={socket}
        mobileId={mobileId}
      />
    </S.Container>
  );
}

function ModelList({ initialModels, socket, mobileId }) {
  const {
    models,
    activeIndex,
    dotPosition,
    listRef,
    itemRefs,
    handleItemClick,
    isCurrentItem,
    isInitialScrollComplete,
    showScrollHint,
  } = useModelListLogic({ initialModels, socket, mobileId });

  useFeedback(activeIndex);

  return (
    <>
      <S.VerticalLine>
        <S.ActiveDot $position={dotPosition} />
      </S.VerticalLine>
      <S.VerticalText>{activeIndex + 1}th</S.VerticalText>
      <S.ModelList ref={listRef}>
        {models.map((model, index) => (
          <S.ModelItem
            key={`${model.name}-${index}`}
            ref={(el) => (itemRefs.current[index] = el)}
            data-index={index}
            $isCurrent={isCurrentItem(index)}
            $distance={index - (activeIndex ?? 0)}
            onClick={() => handleItemClick(index)}
          >
            <S.ModelName
              $isCurrent={isCurrentItem(index)}
              $distance={index - (activeIndex ?? 0)}
            >
              {model.name}
            </S.ModelName>
            {isCurrentItem(index) && (
              <S.ModelDetails>
                {model.explanation && <p>{model.explanation}</p>}
                {model.year && <p>Year: {model.year}</p>}
                {model.place && <p>Place: {model.place}</p>}
                {model.citation && <p>Citations: {model.citation}</p>}
                {model.version && <p>Version: {model.version}</p>}
              </S.ModelDetails>
            )}
          </S.ModelItem>
        ))}
      </S.ModelList>
      <S.ScrollHint $visible={showScrollHint}>
        Scroll to explore the gallery
      </S.ScrollHint>
    </>
  );
}
