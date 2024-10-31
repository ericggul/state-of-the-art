"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";

const Backend = dynamic(() => import("@/components/backend"));

export default function ScreenWrapper() {
  return (
    <Suspense>
      <Backend isTesting={true} />
    </Suspense>
  );
}
