"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const MobileV1 = dynamic(() => import("@/components/mobile/v1"));
const MobileV2 = dynamic(() => import("@/components/mobile/v2"));

function MobileSelector() {
  const searchParams = useSearchParams();
  const version = searchParams.get("v");

  // const MobileComponent = version === "1" ? MobileV1 : MobileV2;

  return <MobileV2 />;
}

export default function MobileWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MobileSelector />
    </Suspense>
  );
}
