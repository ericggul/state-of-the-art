"use client";

import ScreenEl from "@/components/screen";
import Conductor from "@/components/old/conductor";

import { Suspense, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScreenWrapper() {
  return (
    <Suspense>
      <Screen />
    </Suspense>
  );
}

function Screen() {
  const searchParams = useSearchParams();

  const layerIdx = searchParams.get("layerIdx");
  const versionIdx = searchParams.get("v") || 0;

  const isConductor = useMemo(() => layerIdx == "0", [layerIdx]);

  useEffect(() => {
    if (layerIdx !== null) {
      document.title = `Screen ${layerIdx} | `;
    } else {
      document.title = "Screen | ";
    }
  }, [layerIdx]);

  return (
    <>
      <ScreenEl layerIdx={layerIdx} versionIdx={versionIdx} />
      {isConductor && <Conductor />}
    </>
  );
}
