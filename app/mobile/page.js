"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const MobileV1 = dynamic(() => import("@/components/mobile/v1"));
const MobileV2 = dynamic(() => import("@/components/mobile/v2"));

export default function MobileWrapper() {
  const searchParams = useSearchParams();
  const version = searchParams.get("v");

  const MobileComponent = version === "2" ? MobileV2 : MobileV1;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MobileComponent />
    </Suspense>
  );
}
