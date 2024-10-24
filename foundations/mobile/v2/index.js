import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as S from "./styles";
import { MODELS } from "@/components/controller/constant/models/v2";
import { flattenModels, filterModels } from "@/components/frontend/utils";

export default function Mobile() {
  // Flatten and refine the MODELS object into an array
  const modelsArray = useMemo(() => {
    const flattened = flattenModels(MODELS);
    return filterModels(flattened);
  }, []);

  return (
    <S.Container>
      <ModelList initialModels={modelsArray} />
    </S.Container>
  );
}

function ModelList({ initialModels }) {
  const [models, setModels] = useState(initialModels);
  const [activeIndex, setActiveIndex] = useState(null);
  const itemRefs = useRef([]);
  const listRef = useRef(null);
  const observerRef = useRef(null);

  const addMoreModels = useCallback(() => {
    const newModels = [...Array(10)].map(() => {
      const randomIndex = Math.floor(Math.random() * initialModels.length);
      return initialModels[randomIndex];
    });
    setModels((prevModels) => [...prevModels, ...newModels]);
  }, [initialModels]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const callback = (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry.isIntersecting) {
        addMoreModels();
      }
    };

    observerRef.current = new IntersectionObserver(callback, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [addMoreModels]);

  useEffect(() => {
    const lastItemRef = itemRefs.current[itemRefs.current.length - 1];
    if (lastItemRef && observerRef.current) {
      observerRef.current.observe(lastItemRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [models]);

  useEffect(() => {
    const observerOptions = {
      root: listRef.current,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute("data-index"));
        if (entry.isIntersecting) {
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [models]);

  return (
    <S.ModelList ref={listRef}>
      {models.map((model, index) => (
        <S.ModelItem
          key={`${model.name}-${index}`}
          ref={(el) => (itemRefs.current[index] = el)}
          data-index={index}
          isActive={activeIndex === index}
        >
          <S.ModelName>{model.name}</S.ModelName>
          {activeIndex === index && (
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
  );
}
