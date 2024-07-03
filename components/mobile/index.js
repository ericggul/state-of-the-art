"use client";

import * as S from "./styles";

import { useEffect, useRef, useState } from "react";
import useSocket from "@/utils/socket/useSocketMobile";

//uuid v4
import { v4 as uuidv4 } from "uuid";

///Test: FC-3d 0
import FC3D0 from "@/components/test/fc-3d/0";

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

  return (
    <S.Container>
      <FC3D0 onLayerChange={setLayersExpanded} />
    </S.Container>
  );
}
