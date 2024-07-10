"use client";

import dynamic from "next/dynamic";

const Screen0 = dynamic(() => import("@/components/screen/v0"));
const Screen1 = dynamic(() => import("@/components/screen/v1"));

const ARR = [Screen0, Screen1];

export default function ScreenWrapper({ layerIdx, versionIdx = 0 }) {
  return (
    <>
      {versionIdx == 0 && <Screen0 layerIdx={layerIdx} />}
      {versionIdx == 1 && <Screen1 layerIdx={layerIdx} />}
    </>
  );
}
