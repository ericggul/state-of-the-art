"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";

const Frontend = dynamic(() => import("@/components/frontend"));
const Backend = dynamic(() => import("@/components/backend/screen"));

import useSocketScreen from "@/utils/socket/useSocketScreen";

export default function ScreenWrapper() {
  const socket = useSocketScreen({
    layerIdx: 0,
    handleNewArchitectures,
  });

  ////Architectures handling logic
  const [architecturesArchiving, setArchitecturesArchiving] = useState([]);
  const [currentArchitectures, setCurrentArchitectures] = useState([]);

  function handleNewArchitectures(data) {
    console.log(data);
    try {
      setCurrentArchitectures(data.currentArchitectures);
      setArchitecturesArchiving((arr) => [
        ...arr,
        ...data.currentArchitectures,
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Suspense>
      <Frontend currentArchitectures={currentArchitectures} />
    </Suspense>
  );
}
