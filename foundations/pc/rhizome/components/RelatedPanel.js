import React, { useState, useEffect, useRef } from "react";
import { ANIMATION } from "../constants";
import TypewriterText from "./TypewriterText";
import * as S from "../styles";

export default function RelatedPanel({ currentModel, relatedModels }) {
  const listRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);

  // Animate items appearing one by one
  useEffect(() => {
    if (!relatedModels.length) return;

    setVisibleItems([]); // Reset on new models

    relatedModels.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index]);
      }, index * 400); // 400ms delay between each item
    });
  }, [relatedModels]);

  // Auto-scroll animation
  useEffect(() => {
    if (listRef.current && relatedModels.length > 0) {
      const list = listRef.current;
      let currentIndex = 1;

      const scrollToNextItem = () => {
        const items = list.children;
        if (currentIndex >= items.length) {
          currentIndex = 1;
          list.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const nextItem = items[currentIndex];
          nextItem.scrollIntoView({ behavior: "smooth", block: "start" });
          currentIndex++;
        }
      };

      list.scrollTo({ top: 0 });
      const intervalId = setInterval(
        scrollToNextItem,
        ANIMATION.SCROLL_INTERVAL
      );
      return () => clearInterval(intervalId);
    }
  }, [relatedModels]);

  if (!currentModel || !relatedModels.length) return null;

  return (
    <S.RelatedPanel>
      <S.PanelTitle>
        <TypewriterText text={`Connected to ${currentModel}`} speed={30} />
      </S.PanelTitle>
      <S.RelatedList ref={listRef}>
        {relatedModels.map(
          (model, index) =>
            visibleItems.includes(index) && (
              <S.RelatedItem key={index} $strength={model.value / 10}>
                <S.ModelHeader>
                  <S.ModelName>
                    <TypewriterText text={model.name} speed={20} />
                  </S.ModelName>
                  <S.ModelVersion>
                    <TypewriterText text={model.version} speed={20} />
                  </S.ModelVersion>
                </S.ModelHeader>
                <S.RelationText>
                  <TypewriterText text={model.relation} speed={15} />
                </S.RelationText>
                <S.ConnectionStrength $value={model.value / 10} />
              </S.RelatedItem>
            )
        )}
      </S.RelatedList>
    </S.RelatedPanel>
  );
}
