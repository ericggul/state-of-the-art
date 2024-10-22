"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Frontend = dynamic(() => import("@/components/frontend"));

const CURRENT_TESTING_VERSION = "v5.0.4.3";

export default function ScreenWrapper() {
  return (
    <Suspense>
      <Screen isTesting={true} />
    </Suspense>
  );
}

function Screen() {
  return (
    <>
      <Frontend isTesting={true} initVersion={CURRENT_TESTING_VERSION} />
    </>
  );
}
