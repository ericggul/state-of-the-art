"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Frontend = dynamic(() => import("@/components/frontend/architecture"));

const CURRENT_TESTING_VERSION = "v1.0";

export default function ScreenWrapper() {
  return (
    <Suspense>
      <Screen />
    </Suspense>
  );
}

function Screen() {
  return (
    <>
      <Frontend version={CURRENT_TESTING_VERSION} />
    </>
  );
}
