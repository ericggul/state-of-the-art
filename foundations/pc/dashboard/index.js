import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import ModelDiagram from "./ModelDiagram";
import PerformanceChart from "./PerformanceChart";
import RelatedPapers from "./RelatedPapers";
import TypewriterText from "./TypewriterText";
import ModelLimitations from "./ModelLimitations";
import { MODEL_IMAGE, DEFAULT_MODEL } from "./constants";

export default function Dashboard() {
  const { currentArchitectures } = useScreenStore();
  const [prevModel, setPrevModel] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (currentArchitectures[0] && currentArchitectures[0] !== prevModel) {
      setPrevModel(model);
      setModel(currentArchitectures[0]);
    }
  }, [currentArchitectures]);

  const defaultModel = DEFAULT_MODEL;

  const currentModel = model || defaultModel;

  return (
    <S.Container>
      <S.Header>
        <S.Title>
          <TypewriterText
            text={`${currentModel.name || ""} - ${currentModel.version || ""}`}
            speed={30}
          />
        </S.Title>
        <S.Subtitle>
          <TypewriterText
            text={`${currentModel.year || ""}, ${currentModel.place || ""}`}
            speed={30}
          />
        </S.Subtitle>
      </S.Header>

      <S.Grid>
        <S.Card>
          <S.CardTitle>Model Overview</S.CardTitle>
          <S.ModelImage src={MODEL_IMAGE} alt={currentModel.name} />
          <S.Description>
            <TypewriterText text={currentModel.explanation} speed={20} />
          </S.Description>
        </S.Card>

        <S.Card>
          <S.CardTitle>Architecture</S.CardTitle>
          <ModelDiagram />
        </S.Card>

        <S.Card>
          <S.CardTitle>Performance Metrics</S.CardTitle>
          <PerformanceChart performance={currentModel.performance} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Model Stats</S.CardTitle>
          <S.StatGrid>
            <S.Stat>
              <S.StatLabel>Citations</S.StatLabel>
              <S.StatValue>
                <TypewriterText
                  text={currentModel.citation?.toString() || ""}
                  speed={30}
                />
              </S.StatValue>
            </S.Stat>
            <S.Stat>
              <S.StatLabel>Parameters</S.StatLabel>
              <S.StatValue>
                <TypewriterText text={currentModel.parameters} speed={30} />
              </S.StatValue>
            </S.Stat>
            <S.Stat>
              <S.StatLabel>Training Data</S.StatLabel>
              <S.StatValue>
                <TypewriterText text={currentModel.trainingData} speed={30} />
              </S.StatValue>
            </S.Stat>
          </S.StatGrid>
        </S.Card>

        <S.Card>
          <S.CardTitle>Model Limitations</S.CardTitle>
          <ModelLimitations />
        </S.Card>

        <S.Card>
          <S.CardTitle>Related Papers</S.CardTitle>
          <RelatedPapers />
        </S.Card>
      </S.Grid>
    </S.Container>
  );
}
