"use client";

import { memo } from "react";
import * as S from "./styles";

import useScreenStore from "@/components/screen/store";

const VIDEOS = ["01_close", "01_far", "02_close", "02_far"];

const Idle = memo(function Idle() {
  const deviceIdx = useScreenStore((state) => state.deviceIndex || 0);
  const intDeviceIdx = parseInt(deviceIdx, 10);

  console.log(deviceIdx, intDeviceIdx);

  return (
    <S.Container>
      <video
        src={`/videos/${VIDEOS[intDeviceIdx % VIDEOS.length]}.mp4`}
        autoPlay
        loop
        muted
      />
    </S.Container>
  );
});

Idle.displayName = "Idle";
export default Idle;
