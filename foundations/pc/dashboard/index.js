import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useStore from "@/components/screen/store";
import ModelDiagram from "./ModelDiagram";
import PerformanceChart from "./PerformanceChart";
import RelatedPapers from "./RelatedPapers";
import TypewriterText from "./TypewriterText";
import ModelFeatures from "./ModelFeatures";
import ModelStats from "./ModelStats";
import { DEFAULT_MODEL } from "./constants";

const DEFAULT_IMAGE =
  "https://via.placeholder.com/300x200.png?text=Model+Architecture";

export default function Dashboard() {
  const { currentArchitectures } = useStore();
  const [prevModel, setPrevModel] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (currentArchitectures[0] && currentArchitectures[0] !== prevModel) {
      setPrevModel(model);
      setModel(currentArchitectures[0]);
    }
  }, [currentArchitectures]);

  const currentModel = model || DEFAULT_MODEL;

  const getTopStats = (modelStats, maxStats = 3) => {
    if (!modelStats) return [];

    return Object.entries(modelStats)
      .filter(([key, value]) => value !== undefined && value !== null)
      .sort(
        ([keyA], [keyB]) =>
          STATS_CONFIG[keyA].priority - STATS_CONFIG[keyB].priority
      )
      .slice(0, maxStats)
      .map(([key, value]) => ({
        key,
        value,
        ...STATS_CONFIG[key],
      }));
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>
          <TypewriterText
            text={`${currentModel.name} - ${currentModel.id}`}
            speed={30}
          />
        </S.Title>
        <S.Subtitle>
          <TypewriterText
            text={`${currentModel.year}, ${currentModel.authors}`}
            speed={30}
          />
        </S.Subtitle>
      </S.Header>

      <S.Grid>
        <S.Card>
          <S.CardTitle>Model Overview</S.CardTitle>
          <S.ModelImageWrapper>
            <S.ModelImage
              src={currentModel.image || DEFAULT_IMAGE}
              alt={currentModel.name}
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE;
              }}
            />
          </S.ModelImageWrapper>
          <S.Description>
            <TypewriterText text={currentModel.explanation} speed={20} />
          </S.Description>
        </S.Card>

        <S.Card>
          <S.CardTitle>Architecture</S.CardTitle>
          <ModelDiagram model={currentModel} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Performance Metrics</S.CardTitle>
          <PerformanceChart performance={currentModel.performance} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Model Stats</S.CardTitle>
          <ModelStats model={currentModel} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Model Features</S.CardTitle>
          <ModelFeatures model={currentModel} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Related Papers</S.CardTitle>
          <RelatedPapers model={currentModel} />
        </S.Card>
      </S.Grid>
    </S.Container>
  );
}
