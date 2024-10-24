import React, { useState, useEffect, useRef, useMemo } from "react";
import * as S from "./styles";
import { MODELS } from "@/components/controller/constant/models/v2";

export default function Mobile() {
  // Flatten the MODELS object into an array
  const modelsArray = useMemo(() => flattenModels(MODELS), []);

  return (
    <S.Container>
      <ModelList models={modelsArray} />
    </S.Container>
  );
}

// Utility function to flatten the nested MODELS object
function flattenModels(models) {
  const result = [];
  function recurse(obj) {
    for (const key in obj) {
      if (obj[key].name) {
        result.push({
          name: obj[key].name || "",
          explanation: obj[key].explanation || "",
          year: obj[key].year || "",
          place: obj[key].place || "",
        });
      }
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        recurse(obj[key]);
      }
    }
  }
  recurse(models);
  return result;
}

function ModelList({ models }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const itemRefs = useRef([]);
  const listRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: listRef.current,
      rootMargin: "-50% 0px -50% 0px", // This centers the focus
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
  }, []);

  return (
    <S.ModelList ref={listRef}>
      {models.map((model, index) => (
        <S.ModelItem
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          data-index={index}
          isActive={activeIndex === index}
        >
          <S.ModelName>{model.name}</S.ModelName>
          {activeIndex === index && model.explanation && (
            <S.ModelDetails>
              <p>{model.explanation}</p>
              {model.year && <p>Year: {model.year}</p>}
              {model.place && <p>Place: {model.place}</p>}
            </S.ModelDetails>
          )}
        </S.ModelItem>
      ))}
    </S.ModelList>
  );
}
