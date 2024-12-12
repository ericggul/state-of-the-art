import React, { useState, useEffect, useRef } from "react";
import { ANIMATION } from "../../constants";
import TextScramble from "@/foundations/pc/utils/TextScramble";
import * as S from "./styles";

export default function RelatedPanel({ currentModel, relatedModels, hue }) {
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
    <>
      <S.LeftLine $hue={hue} />
      <S.PanelTitle>
        <TextScramble text={`Models similar to ${currentModel}`} />
      </S.PanelTitle>
      <S.RelatedPanel $hue={hue}>
        <S.RelatedList ref={listRef}>
          {relatedModels.map(
            (model, index) =>
              visibleItems.includes(index) && (
                <S.RelatedItem
                  key={index}
                  $strength={model.value / 10}
                  $hue={hue}
                >
                  <S.ModelHeader>
                    <S.ModelName $hue={hue}>
                      <TextScramble text={model.name} />
                    </S.ModelName>
                    <S.ModelVersion $hue={hue}>
                      <TextScramble text={model.category} />
                    </S.ModelVersion>
                  </S.ModelHeader>
                  <S.RelationText $hue={hue}>
                    <TextScramble text={"Similarity: " + model.relation} />
                  </S.RelationText>
                  <S.ConnectionStrength $value={model.value / 10} $hue={hue} />
                </S.RelatedItem>
              )
          )}
        </S.RelatedList>
      </S.RelatedPanel>
    </>
  );
}
