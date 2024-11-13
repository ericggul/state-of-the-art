import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useStore from "@/components/screen/store";
import ModelDiagram from "./components/ModelDiagram";
import PerformanceChart from "./components/PerformanceChart";
import RelatedPapers from "./components/RelatedPapers";
import TypewriterText from "./components/TypewriterText";
import ModelFeatures from "./components/ModelFeatures";
import { DEFAULT_MODEL } from "./utils/constants";
import { getModelData } from "./utils/dataProcessor";
import ModelImage from "./components/ModelImage";

//here read csv from the route and parse it into json
const FILE_URL = "/db/1113.csv";

const DEFAULT_IMAGE =
  "https://via.placeholder.com/300x200.png?text=Model+Architecture";

// Card Component
const Card = ({ title, children }) => (
  <S.Card>
    <S.CardTitle>{title}</S.CardTitle>
    {children}
  </S.Card>
);

export default function Dashboard() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  console.log(currentArchitectures);
  const isTransition = useStore((state) => state.isTransition);
  const [prevModel, setPrevModel] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function updateModel() {
      if (currentArchitectures[0] && currentArchitectures[0] !== prevModel) {
        setPrevModel(model);
        const modelData = await getModelData(currentArchitectures[0]);
        setModel(modelData);
      }
    }
    updateModel();
  }, [currentArchitectures]);

  const currentModel = model || DEFAULT_MODEL;
  console.log(currentModel);

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
        <Card title="Model Overview">
          <ModelImage model={currentModel} />
        </Card>

        <Card title="Architecture">
          <ModelDiagram model={currentModel} />
        </Card>

        <Card title="Performance Metrics">
          <PerformanceChart performance={currentModel.performance} />
        </Card>

        <Card title="Model Features">
          <ModelFeatures model={currentModel} />
        </Card>

        <Card title="Related Papers">
          <RelatedPapers model={currentModel} />
        </Card>
      </S.Grid>
    </S.Container>
  );
}
