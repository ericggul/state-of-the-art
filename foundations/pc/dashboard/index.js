import React from "react";
import * as S from "./styles";
import useScreenStore from "@/components/screen/store";
import ModelDiagram from "./ModelDiagram";
import PerformanceChart from "./PerformanceChart";
import RelatedPapers from "./RelatedPapers";

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

  const model = currentArchitectures[0] || {
    name: "GPT",
    version: "v4.2.3.1",
    year: 2018,
    place: "Alec Radford et al., OpenAI",
    citation: 13500,
    explanation:
      "Introduced unsupervised pre-training for language models using Transformer decoder.",
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>
          {model.name} - v{model.version}
        </S.Title>
        <S.Subtitle>
          {model.year}, {model.place}
        </S.Subtitle>
      </S.Header>

      <S.Grid>
        <S.Card>
          <S.CardTitle>Model Overview</S.CardTitle>
          <S.ModelImage src={dummyModelImage} alt={model.name} />
          <S.Description>{model.explanation}</S.Description>
        </S.Card>

        <S.Card>
          <S.CardTitle>Architecture</S.CardTitle>
          <ModelDiagram modelName={model.name} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Performance Metrics</S.CardTitle>
          <PerformanceChart modelName={model.name} />
        </S.Card>

        <S.Card>
          <S.CardTitle>Model Stats</S.CardTitle>
          <S.StatGrid>
            <S.Stat>
              <S.StatLabel>Citations</S.StatLabel>
              <S.StatValue>{model.citation}</S.StatValue>
            </S.Stat>
            <S.Stat>
              <S.StatLabel>Parameters</S.StatLabel>
              <S.StatValue>175B</S.StatValue>
            </S.Stat>
            <S.Stat>
              <S.StatLabel>Training Data</S.StatLabel>
              <S.StatValue>570GB</S.StatValue>
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
