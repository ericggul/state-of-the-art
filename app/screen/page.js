"use client";

import ScreenEl from "@/components/screen";
import Conductor from "@/components/conductor";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function Screen() {
  const searchParams = useSearchParams();

  const layerIdx = searchParams.get("layerIdx");
  const isConductor = useMemo(() => layerIdx == "0", [layerIdx]);

  return (
    <>
      <ScreenEl layerIdx={layerIdx} />
      {isConductor && <Conductor />}
    </>
  );
}
