import React, { useRef, useEffect } from "react";
import { ANIMATION } from "../constants";
import * as S from "../styles";

export default function RelatedPanel({ currentModel, relatedModels }) {
  const listRef = useRef(null);

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
      <S.PanelTitle>Connected to {currentModel}</S.PanelTitle>
      <S.RelatedList ref={listRef}>
        {relatedModels.map((model, index) => (
          <S.RelatedItem key={index} $strength={model.value / 10}>
            <S.ModelHeader>
              <S.ModelName>{model.name}</S.ModelName>
              <S.ModelVersion>{model.version}</S.ModelVersion>
            </S.ModelHeader>
            <S.RelationText>{model.relation}</S.RelationText>
            <S.ConnectionStrength $value={model.value / 10} />
          </S.RelatedItem>
        ))}
      </S.RelatedList>
    </S.RelatedPanel>
  );
}
