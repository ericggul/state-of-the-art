import React, { useState, useEffect, useCallback } from "react";
import * as S from "./styles";
import useStore from "@/components/screen/store";
import useDebounce from "@/utils/hooks/useDebounce";

import { DEFAULT_MODEL } from "./utils/constants";
import { getModelData } from "./utils/dataProcessor";

import ModelImage from "./components/0_ModelImage";
import ModelDiagram from "./components/1_ModelDiagram";
import PerformanceChart from "./components/2_PerformanceChart";
import RelatedPapers from "./components/4_RelatedPapers";
import ModelFeatures from "./components/3_ModelFeatures";

import Frame from "@/foundations/pc/frame/full";
import Lines from "./components/Lines";

const LAYOUT = [
  [
    {
      width: "35vw",
      marginRight: "3vw",
      height: "34vh",
    },
    { width: "15vw", marginRight: "3vw", height: "34vh" },
    { width: "35vw", height: "34vh" },
  ],
  [
    { width: "25vw", marginRight: "3vw" },
    { width: "25vw", marginRight: "3vw" },
    { width: "35vw" },
  ],
];

// Card Component
// Card Component
const Card = ({ title, children, layout, hue }) => (
  <S.CardWrapper style={layout}>
    <S.CardTitle $hue={hue}>{title}</S.CardTitle>
    <S.Card $hue={hue}>{children}</S.Card>
  </S.CardWrapper>
);

export default function Dashboard() {
  const currentArchitectures = useStore((state) => state.currentArchitectures);
  const targetHue = currentArchitectures?.[0]?.hue ?? 230; // Default to 230 if no hue specified
  const debouncedHue = useDebounce(targetHue, 100);
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
    <S.Container $hue={debouncedHue}>
      <S.Bg $hue={debouncedHue} />
      <Frame />
      <Lines />
      <S.Wrapper>
        <S.Row>
          <Card title="Model Overview" layout={LAYOUT[0][0]} hue={debouncedHue}>
            <ModelImage model={currentModel} />
          </Card>

          <Card title="Architecture" layout={LAYOUT[0][1]} hue={debouncedHue}>
            <ModelDiagram model={currentModel} hue={debouncedHue} />
          </Card>

          <Card title="Performance" layout={LAYOUT[0][2]} hue={debouncedHue}>
            {hasPerformanceData(currentModel) ? (
              <PerformanceChart
                performance={currentModel.performance}
                hue={debouncedHue}
              />
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
          <Card title="Features" layout={LAYOUT[1][0]} hue={debouncedHue}>
            <ModelFeatures
              model={currentModel}
              isHighlight={true}
              hue={debouncedHue}
            />
          </Card>

          <Card title="" layout={LAYOUT[1][1]} hue={debouncedHue}>
            <ModelFeatures
              model={currentModel}
              isHighlight={false}
              hue={debouncedHue}
            />
          </Card>

          <Card title="Related Papers" layout={LAYOUT[1][2]} hue={debouncedHue}>
            <RelatedPapers model={currentModel} hue={debouncedHue} />
          </Card>
        </S.Row>
      </S.Wrapper>
    </S.Container>
  );
}
