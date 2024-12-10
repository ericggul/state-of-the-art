import React, { useMemo, memo, useCallback, useRef } from "react";
import { VariableSizeList as List } from "react-window";
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
  const outerRef = useRef(null);
  const itemRefs = useRef([]);
  const listRef = useRef(null);

  const {
    models,
    activeIndex,
    dotPosition,
    handleItemClick,
    isCurrentItem,
    showScrollHint,
    showResetCountdown,
    countdownSeconds,
    showLoading,
    handleUserInteraction,
  } = useModelListLogic({
    initialModels,
    socket,
    mobileId,
    outerRef,
    itemRefs,
    listRef,
  });

  if (countdownSeconds <= 1) {
    return (
      <Loading customText="Session expired. Please scan QR code again to reconnect" />
    );
  }

  const getItemSize = useCallback(
    (index) => {
      return isCurrentItem(index) ? 200 : 60;
    },
    [isCurrentItem]
  );

  const renderItem = ({ index, style }) => {
    const model = models[index];
    return (
      <div
        key={`${model.name}-${index}`}
        ref={(el) => {
          itemRefs.current[index] = el;
        }}
        data-index={index}
        style={style}
      >
        <S.ModelItem
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
                <p style={{ color: `hsla(${model.hue}, 100%, 80%, 1)` }}>
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
      </div>
    );
  };

  return (
    <>
      <S.VerticalLine>
        <S.ActiveDot $position={dotPosition} />
      </S.VerticalLine>
      <S.VerticalText>{activeIndex + 1}th</S.VerticalText>
      <List
        height={window.innerHeight}
        itemCount={models.length}
        itemSize={getItemSize}
        width={"100%"}
        onScroll={handleUserInteraction}
        ref={listRef}
        outerRef={outerRef}
      >
        {renderItem}
      </List>
      {showLoading && <ScrollLoading />}
      {(showScrollHint || showResetCountdown) && (
        <S.ScrollHint $urgent={showResetCountdown}>
          {showResetCountdown
            ? countdownSeconds % 4 === 0
              ? "Keep on Scrolling"
              : "Session expires in " + countdownSeconds + "s"
            : "Scroll to explore the gallery"}
        </S.ScrollHint>
      )}
    </>
  );
});

export default Mobile;
