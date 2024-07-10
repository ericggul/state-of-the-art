"use client";

import dynamic from "next/dynamic";

const Screen0 = dynamic(() => import("@/components/screen/0"));
const Screen1 = dynamic(() => import("@/components/screen/1"));

const ARR = [Screen0, Screen1];

export default function ScreenWrapper({ layerIdx, testIdx = 0 }) {
  return (
    <>
      {testIdx == 0 && <Screen0 layerIdx={layerIdx} />}
      {testIdx == 1 && <Screen1 layerIdx={layerIdx} />}
    </>
  );
}
