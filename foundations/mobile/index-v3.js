import React, { useMemo, memo } from "react";
import * as S from "./styles";
import { MODELS } from "@/components/controller/constant/models";
import { useModelListLogic } from "./utils/modelListLogic/useLogic";
import { getModelTypeName } from "@/utils/constant/modelTypes";
import { generateInitialModelArray } from "./utils/initialModelGeneration";
import useScreenStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

import Loading from "@/foundations/mobile/loading";
import ScrollLoading from "./ScrollLoading";

const Mobile = memo(function Mobile({ socket, mobileId }) {
  const currentArchitectures = useScreenStore(
    (state) => state.currentArchitectures
  );
  const targetHue = currentArchitectures?.[0]?.hue ?? 230;
  const debouncedHue = useDebounce(targetHue, 100);
  const modelsArray = useMemo(() => generateInitialModelArray(MODELS), []);

  return (
    <S.Container $hue={debouncedHue}>
      <ModelList
        initialModels={modelsArray}
        socket={socket}
        mobileId={mobileId}
      />
    </S.Container>
  );
});

const ModelList = memo(function ModelList({ initialModels, socket, mobileId }) {
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
    showResetCountdown,
    countdownSeconds,
    showLoading,
  } = useModelListLogic({ initialModels, socket, mobileId });

  if (countdownSeconds <= 1) {
    return (
      <Loading customText="Session expired. Please scan QR code again to reconnect" />
    );
  }

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
            $hue={model.hue || 0}
          >
            <S.ModelName
              $isCurrent={isCurrentItem(index)}
              $distance={index - (activeIndex ?? 0)}
            >
              {model.name}
            </S.ModelName>
            {isCurrentItem(index) && (
              <S.ModelDetails>
                {model.category && (
                  <p
                    style={{
                      color: `hsla(${model.hue}, 100%, 80%, 1)`,
                      //before styling
                    }}
                  >
                    {getModelTypeName(model.category)}
                  </p>
                )}
                {model.explanation && <p>{model.explanation}</p>}

                {model.year && <p>Year: {model.year}</p>}
                {model.citation && <p>Citations: {model.citation}</p>}
                {model.place && <p>{model.place}</p>}
                {model.version && <p>{model.version}</p>}
              </S.ModelDetails>
            )}
          </S.ModelItem>
        ))}
        <ScrollLoading />
      </S.ModelList>
      {
        <S.ScrollHint
          $visible={showScrollHint || showResetCountdown}
          $urgent={showResetCountdown}
        >
          {showResetCountdown
            ? countdownSeconds % 4 === 0
              ? "Keep on Scrolling"
              : "Session expires in " + countdownSeconds + "s"
            : "Scroll to explore the gallery"}
        </S.ScrollHint>
      }
    </>
  );
});

export default Mobile;
