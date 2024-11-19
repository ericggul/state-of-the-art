"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/foundations/mobile/v4/loading";

const MobileV1 = dynamic(() => import("@/components/mobile/v1"));
const MobileV2 = dynamic(() => import("@/components/mobile/v2"));
const MobileV3 = dynamic(() => import("@/components/mobile/v3"));
const MobileV4 = dynamic(() => import("@/components/mobile/v4"));

function MobileSelector() {
  const searchParams = useSearchParams();
  const version = searchParams.get("v");

  switch (version) {
    case "1":
      return <MobileV1 />;
    case "2":
      return <MobileV2 />;
    case "3":
      return <MobileV3 />;
    case "4":
      return <MobileV4 />;
    default:
      return <MobileV4 />;
  }
}

export default function MobileWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <MobileSelector />
    </Suspense>
  );
}
