"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

const Idle = dynamic(() => import("@/components/idle"));

export default function IdleWrapper() {
  return (
    <Suspense>
      <Idle isTesting={true} />
    </Suspense>
  );
}
