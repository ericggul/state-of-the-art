"use client";

import dynamic from "next/dynamic";

import { Suspense, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const Mobile0 = dynamic(() => import("@/components/_old/mobile/v0"));
const Mobile2 = dynamic(() => import("@/components/_old/mobile/v2"));

export default function MobileWrapper() {
  return (
    <Suspense>
      <Mobile />
    </Suspense>
  );
}

function Mobile() {
  const searchParams = useSearchParams();
  const versionIdx = searchParams.get("v") || 0;

  return (
    <>
      {versionIdx === "0" && <Mobile0 />}
      {versionIdx === "2" && <Mobile2 />}
    </>
  );
}
