"use client";

import * as S from "./styles";

import { useEffect, useRef, useState } from "react";
import useSocket from "@/utils/socket/useSocketMobile";

//uuid v4
import { v4 as uuidv4 } from "uuid";

///Test: FC-3d 0
import FC3D0 from "./fc-3d-test";

export default function Mobile() {
  const mobileId = useRef(uuidv4());

  const socket = useSocket({
    mobileId: mobileId.current,
  });

  const [layersExpanded, setLayersExpanded] = useState([]);
  const memorisedLayersRef = useRef(layersExpanded);

  useEffect(() => {
    if (layersExpanded.length > 0 && socket && socket.current) {
      const layerVal = layersExpanded.find((layer, idx) => layer !== memorisedLayersRef.current[idx]);
      const layerIdx = layersExpanded.findIndex((layer, idx) => layer !== memorisedLayersRef.current[idx]);

      socket.current.emit("mobile-layer-clicked", {
        mobileId: mobileId.current,
        layerIdx,
        layerVal,
      });
    }

    memorisedLayersRef.current = layersExpanded;
  }, [layersExpanded]);

  const [trainingIteration, setTrainingIteration] = useState(0);
  function handleTrainButtonClick() {
    if (socket && socket.current) {
      socket.current.emit("mobile-training", {
        mobileId: mobileId.current,
      });
      setTrainingIteration((i) => i + 1);
    }
  }

  return (
    <S.Container>
      <FC3D0 onLayerChange={setLayersExpanded} training={trainingIteration} />
      <S.TrainButton onClick={handleTrainButtonClick}>{">>"} Train Model</S.TrainButton>
    </S.Container>
  );
}
