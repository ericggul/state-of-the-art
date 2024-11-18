import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as S from "./styles";
import { MODELS } from "@/components/controller/constant/models/v3";
import { flattenModels, filterModels } from "@/components/frontend/utils";
import useFeedback from "./utils/useFeedback";

// Constants
const INTERSECTION_OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const LIST_OBSERVER_OPTIONS = {
  rootMargin: "-50% 0px -50% 0px",
  threshold: 0,
};

const NEW_MODELS_COUNT = 10;

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
  const [models, setModels] = useState(initialModels);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [manuallySelectedIndex, setManuallySelectedIndex] = useState(null);
  const [dotPosition, setDotPosition] = useState(0);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const observerRef = useRef(null);

  const activeIndex = manuallySelectedIndex ?? currentIndex;
  useFeedback(activeIndex);

  // Add infinite scroll functionality
  const addMoreModels = useCallback(() => {
    setModels((prevModels) => [
      ...prevModels,
      ...[...Array(NEW_MODELS_COUNT)].map(
        () => initialModels[Math.floor(Math.random() * initialModels.length)]
      ),
    ]);
  }, [initialModels]);

  // Infinite scroll observer
  useEffect(() => {
    const callback = (entries) => {
      if (entries[entries.length - 1].isIntersecting) {
        addMoreModels();
      }
    };

    observerRef.current = new IntersectionObserver(
      callback,
      INTERSECTION_OPTIONS
    );

    return () => observerRef.current?.disconnect();
  }, [addMoreModels]);

  // Observe last item for infinite scroll
  useEffect(() => {
    const lastItemRef = itemRefs.current[itemRefs.current.length - 1];
    if (lastItemRef && observerRef.current) {
      observerRef.current.observe(lastItemRef);
    }

    return () => observerRef.current?.disconnect();
  }, [models]);

  // Current item observer
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          setCurrentIndex(index);
          setManuallySelectedIndex(null);
          setDotPosition((index / (models.length - 1)) * 100);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      ...LIST_OBSERVER_OPTIONS,
      root: listRef.current,
    });

    itemRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer?.disconnect();
  }, [models]);

  // Socket emission effect
  useEffect(() => {
    if (activeIndex === null || !socket?.current) return;

    const activeModel = models[activeIndex];

    try {
      socket.current.emit("mobile-new-architecture", {
        currentArchitectures: [activeModel],
        mobileId,
      });

      if (activeModel.explanation) {
        socket.current.emit("mobile-new-speech", {
          text: `${activeModel.name} ${activeModel.explanation}`,
          mobileId,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [activeIndex, models, socket, mobileId]);

  const handleItemClick = useCallback((index) => {
    setManuallySelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  const isCurrentItem = useCallback(
    (index) =>
      manuallySelectedIndex === index ||
      (manuallySelectedIndex === null && currentIndex === index),
    [manuallySelectedIndex, currentIndex]
  );

  return (
    <>
      <S.VerticalLine>
        <S.ActiveDot $percentage={dotPosition} />
      </S.VerticalLine>
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
    </>
  );
}
