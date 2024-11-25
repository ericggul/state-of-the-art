"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

const Idle = dynamic(() => import("@/components/screen/idle/projector"));
const Ending = dynamic(() => import("@/components/screen/ending"));

export default function IdleWrapper() {
  return (
    <Suspense>
      <Idle isTesting={true} />
      {/* <Ending /> */}
    </Suspense>
  );
}
