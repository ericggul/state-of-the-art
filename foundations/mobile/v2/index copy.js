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

export default function Mobile({ socket, mobileId }) {
  // Flatten and refine the MODELS object into an array
  const modelsArray = useMemo(() => {
    const flattened = flattenModels(MODELS);
    return filterModels(flattened);
  }, []);

  return (
    <S.Container>
      <ModelList initialModels={modelsArray} socket={socket} />
    </S.Container>
  );
}

function ModelList({ initialModels, socket }) {
  const [models, setModels] = useState(initialModels);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [manuallySelectedIndex, setManuallySelectedIndex] = useState(null);
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
          setCurrentIndex(index);
          // Reset manually selected index when scrolling
          setManuallySelectedIndex(null);
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

  useEffect(() => {
    console.log(currentIndex);
    const activeIndex =
      manuallySelectedIndex !== null ? manuallySelectedIndex : currentIndex;
    if (activeIndex !== null && socket && socket.current) {
      console.log(models[activeIndex]);
      try {
        socket.current.emit("mobile-new-architecture", {
          currentArchitectures: [models[activeIndex]],
          mobileId,
        });
      } catch (e) {
        console.log(e);
      }

      /////TEMPORARY TESTING WITHOUT CONTROLLER: SPEECH////////////////////////////////
      if (models[activeIndex].explanation) {
        const text =
          models[activeIndex].name + " " + models[activeIndex].explanation;
        socket.current.emit("mobile-new-speech", {
          text,
          mobileId,
        });
      }
      //////////////////////////////////////////////////////////////
    }
  }, [currentIndex, manuallySelectedIndex, models, socket, mobileId]);

  const handleItemClick = (index) => {
    if (manuallySelectedIndex === index) {
      setManuallySelectedIndex(null);
    } else {
      setManuallySelectedIndex(index);
    }
  };

  return (
    <S.ModelList ref={listRef}>
      {models.map((model, index) => (
        <S.ModelItem
          key={`${model.name}-${index}`}
          ref={(el) => (itemRefs.current[index] = el)}
          data-index={index}
          $isCurrent={
            manuallySelectedIndex === index ||
            (manuallySelectedIndex === null && currentIndex === index)
          }
          onClick={() => handleItemClick(index)}
        >
          <S.ModelName>{model.name}</S.ModelName>
          {(manuallySelectedIndex === index ||
            (manuallySelectedIndex === null && currentIndex === index)) && (
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
