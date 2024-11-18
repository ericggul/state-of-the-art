import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as S from "../styles";
import { MODELS } from "@/components/controller/constant/models/v3";
import { flattenModels, filterModels } from "@/components/frontend/utils";
import useFeedback from "../utils/useFeedback";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dotPosition, setDotPosition] = useState(0);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  // Handle scroll
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const handleScroll = () => {
      const containerCenter = window.innerHeight / 2;

      // Find the item closest to center
      let closestDistance = Infinity;
      let closestIndex = 0;
      let dotPos = 0;

      itemRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
          dotPos = rect.top + rect.height / 2;
        }
      });

      setCurrentIndex(closestIndex);
      setDotPosition(dotPos);
    };

    listElement.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => listElement.removeEventListener("scroll", handleScroll);
  }, [models]);

  return (
    <>
      <S.VerticalLine>
        <S.ActiveDot $position={dotPosition} />
      </S.VerticalLine>
      <S.ModelList ref={listRef}>
        {models.map((model, index) => (
          <S.ModelItem
            key={`${model.name}-${index}`}
            ref={(el) => (itemRefs.current[index] = el)}
            $isCurrent={index === currentIndex}
          >
            <S.ModelName $isCurrent={index === currentIndex}>
              {model.name}
            </S.ModelName>
            {index === currentIndex && (
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
