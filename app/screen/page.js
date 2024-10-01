"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Frontend = dynamic(() => import("@/components/frontend/screen"));
const Backend = dynamic(() => import("@/components/backend/screen"));

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
      <Frontend />
    </>
  );
}
