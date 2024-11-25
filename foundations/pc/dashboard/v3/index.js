import React, { useState, useEffect, useCallback } from "react";
import * as S from "./styles";
import useStore from "@/components/screen/store";

import { DEFAULT_MODEL } from "./utils/constants";
import { getModelData } from "./utils/dataProcessor";

import ModelImage from "./components/0_ModelImage";
import ModelDiagram from "./components/1_ModelDiagram";
import PerformanceChart from "./components/2_PerformanceChart";
import RelatedPapers from "./components/4_RelatedPapers";
import ModelFeatures from "./components/3_ModelFeatures";

import Frame from "@/foundations/pc/frame/full";

const LAYOUT = [
  [
    {
      width: "25vw",
      marginRight: "3vw",
      height: "32vh",
    },
    { width: "25vw", marginRight: "3vw", height: "32vh" },
    { width: "35vw", height: "32vh" },
  ],
  [
    { width: "25vw", marginRight: "3vw" },
    { width: "25vw", marginRight: "3vw" },
    { width: "35vw" },
  ],
];

// Card Component
const Card = ({ title, children, layout }) => (
  <S.Card style={layout}>
    <S.CardTitle>{title}</S.CardTitle>
    {children}
  </S.Card>
);

export default function Dashboard() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
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

  const hasPerformanceData = useCallback((model) => {
    return (
      model?.performance?.labels?.length > 0 &&
      model?.performance?.data?.length > 0 &&
      Array.isArray(model.performance.labels) &&
      Array.isArray(model.performance.data)
    );
  }, []);

  return (
    <S.Container>
      <Frame />
      <S.Wrapper>
        <S.Row>
          <Card title="Model Overview" layout={LAYOUT[0][0]}>
            <ModelImage model={currentModel} />
          </Card>

          <Card title="Architecture" layout={LAYOUT[0][1]}>
            <ModelDiagram model={currentModel} />
          </Card>

          <Card title="Performance" layout={LAYOUT[0][2]}>
            {hasPerformanceData(currentModel) ? (
              <PerformanceChart performance={currentModel.performance} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No performance data available
              </div>
            )}
          </Card>
        </S.Row>

        <S.Row>
          <Card title="Features" layout={LAYOUT[1][0]}>
            <ModelFeatures model={currentModel} isHighlight={true} />
          </Card>

          <Card title="" layout={LAYOUT[1][1]}>
            <ModelFeatures model={currentModel} isHighlight={false} />
          </Card>

          <Card title="Related Papers" layout={LAYOUT[1][2]}>
            <RelatedPapers model={currentModel} />
          </Card>
        </S.Row>
      </S.Wrapper>
    </S.Container>
  );
}
