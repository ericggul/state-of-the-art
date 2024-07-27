"use client";

import dynamic from "next/dynamic";

const Screen0 = dynamic(() => import("@/components/screen/v0"));
const Screen1 = dynamic(() => import("@/components/screen/v1"));
const Screen2 = dynamic(() => import("@/components/screen/v2"));

export default function ScreenWrapper({ layerIdx, versionIdx = 0 }) {
  return (
    <>
      {versionIdx == "0" && <Screen0 layerIdx={layerIdx} />}
      {versionIdx == "1" && <Screen1 layerIdx={layerIdx} />}
      {versionIdx == "2" && <Screen2 layerIdx={layerIdx} />}
    </>
  );
}
