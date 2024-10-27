import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import ModelDiagram from "./ModelDiagram";
import PerformanceChart from "./PerformanceChart";
import RelatedPapers from "./RelatedPapers";
import TypewriterText from "./TypewriterText";

// 더미 데이터
const dummyModelImage =
  "https://via.placeholder.com/300x200.png?text=GPT+Model+Image";
const dummyPapers = [
  {
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    url: "#",
  },
  {
    title:
      "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Devlin et al.",
    year: 2018,
    url: "#",
  },
  {
    title: "Language Models are Few-Shot Learners",
    authors: "Brown et al.",
    year: 2020,
    url: "#",
  },
];

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

  const defaultModel = {
    name: "GPT",
    version: "v4.2.3.1",
    year: 2018,
    place: "Alec Radford et al., OpenAI",
    citation: 13500,
    explanation:
      "Introduced unsupervised pre-training for language models using Transformer decoder.",
  };

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
          <S.ModelImage src={dummyModelImage} alt={currentModel.name} />
          <S.Description>
            <TypewriterText text={currentModel.explanation} speed={20} />
          </S.Description>
        </S.Card>

        <S.Card>
          <S.CardTitle>Architecture</S.CardTitle>
          <ModelDiagram modelName={currentModel.name} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Performance Metrics</S.CardTitle>
          <PerformanceChart modelName={currentModel.name} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Model Stats</S.CardTitle>
          <S.StatGrid>
            <S.Stat>
              <S.StatLabel>Citations</S.StatLabel>
              <S.StatValue>
                <TypewriterText
                  text={
                    currentModel.citation
                      ? currentModel.citation.toString()
                      : ""
                  }
                  speed={30}
                />
              </S.StatValue>
            </S.Stat>
            <S.Stat>
              <S.StatLabel>Parameters</S.StatLabel>
              <S.StatValue>
                <TypewriterText text="175B" speed={30} />
              </S.StatValue>
            </S.Stat>
            <S.Stat>
              <S.StatLabel>Training Data</S.StatLabel>
              <S.StatValue>
                <TypewriterText text="570GB" speed={30} />
              </S.StatValue>
            </S.Stat>
          </S.StatGrid>
        </S.Card>

        <S.Card>
          <S.CardTitle>Related Papers</S.CardTitle>
          <RelatedPapers papers={dummyPapers} />
        </S.Card>
      </S.Grid>
    </S.Container>
  );
}
