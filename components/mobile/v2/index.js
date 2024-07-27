"use client";

import * as S from "./styles";

import { useEffect, useRef, useState } from "react";
import useSocket from "@/utils/socket/useSocketMobile";

//uuid v4
import { v4 as uuidv4 } from "uuid";

//Test: FC-3d: version 2
import FC3D2 from "@/foundations/mobile/fc-3d/2";

import UI from "@/foundations/mobile/ui";

export default function Mobile() {
  const mobileId = useRef(uuidv4());

  const socket = useSocket({
    mobileId: mobileId.current,
    handleNewResponse,
  });

  function handleNewResponse(data) {
    console.log("new data", data);
  }

  const [layersExpanded, setLayersExpanded] = useState([]);
  const memorisedLayersRef = useRef(layersExpanded);

  useEffect(() => {
    if (layersExpanded.length > 0 && socket && socket.current) {
      //NEW VERSION
      socket.current.emit("mobile-layer-clicked", {
        mobileId: mobileId.current,
        layersExpanded,
      });
    }

    memorisedLayersRef.current = layersExpanded;
  }, [layersExpanded]);

  const [trainingIteration, setTrainingIteration] = useState(0);
  function handleTrain({ text, params }) {
    const propagationId = uuidv4();
    if (socket && socket.current) {
      socket.current.emit("mobile-training", {
        mobileId: mobileId.current,
        propagationId,
        text,
        params,
      });

      // for (let i = 0; i < LAYER_NUMBER; i++) {
      //   const timeout = setTimeout(() => {
      //     if (socket && socket.current) {
      //       socket.current.emit("conductor-propagation", {
      //         layerIdx: i,
      //         type: "propagation",
      //         mobileId: mobileId.current,
      //         propagationId,
      //       });
      //     }
      //   }, i * TRAINING_INTERVAL);

      //   timeoutRefs.current.push(timeout);
      // }

      // // BACK PROPAGATION
      // for (let i = 0; i < LAYER_NUMBER; i++) {
      //   const timeout = setTimeout(() => {
      //     if (socket && socket.current) {
      //       socket.current.emit("conductor-propagation", {
      //         layerIdx: LAYER_NUMBER - 1 - i,
      //         type: "back-propagation",
      //         mobileId: mobileId.current,
      //         propagationId,
      //       });
      //     }
      //   }, (i + LAYER_NUMBER) * TRAINING_INTERVAL);

      //   timeoutRefs.current.push(timeout);
      // }

      setTrainingIteration((i) => i + 1);
    }
  }

  return (
    <S.Container>
      <FC3D2 onLayerChange={setLayersExpanded} training={trainingIteration} />
      <UI handleTrain={handleTrain} />
    </S.Container>
  );
}
