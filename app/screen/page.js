"use client";

import ScreenEl from "@/components/screen";
import Conductor from "@/components/conductor";

import { useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Screen() {
  const searchParams = useSearchParams();

  const layerIdx = searchParams.get("layerIdx");
  const isConductor = useMemo(() => layerIdx == "0", [layerIdx]);

  useEffect(() => {
    if (layerIdx !== null) {
      document.title = `Screen ${layerIdx} | DDP AI`;
    } else {
      document.title = "Screen | DDP AI";
    }
  }, [layerIdx]);

  return (
    <>
      <ScreenEl layerIdx={layerIdx} />
      {isConductor && <Conductor />}
    </>
  );
}
